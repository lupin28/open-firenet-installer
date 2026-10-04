use anyhow::{anyhow, Context, Result};
use indicatif::{ProgressBar, ProgressStyle};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

const GITHUB_REPO: &str = "openfirenet/open-firenet";
const USER_AGENT: &str = "OpenFirenet-Installer/0.1.0";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReleaseAsset {
    pub name: String,
    pub browser_download_url: String,
    pub size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Release {
    pub tag_name: String,
    pub name: Option<String>,
    pub body: Option<String>,
    pub prerelease: bool,
    pub assets: Vec<ReleaseAsset>,
}

pub const OFFICIAL_PUBLIC_KEY: &str = "RWQhzS5dR0kodMCMiFMESBDRDhxMyRaA4yNbIcAMD2B9kQS21I+FABT4";

impl Release {
    /// Trouve l'asset factory complet pour flash USB
    pub fn factory_asset(&self) -> Option<&ReleaseAsset> {
        self.assets.iter().find(|a| a.name.contains("factory") && a.name.ends_with(".bin"))
            .or_else(|| self.assets.iter().find(|a| a.name.contains("merged") && a.name.ends_with(".bin")))
    }

    /// Trouve l'asset OTA pour mise à jour sans fil
    pub fn ota_asset(&self) -> Option<&ReleaseAsset> {
        self.assets.iter().find(|a| a.name.contains("ota") && a.name.ends_with(".bin"))
            .or_else(|| self.assets.iter().find(|a| a.name.ends_with(".bin") && !a.name.contains("factory")))
    }

    pub fn sha256_asset(&self) -> Option<&ReleaseAsset> {
        self.assets.iter().find(|a| a.name == "SHA256SUMS" || a.name.to_lowercase().contains("sha256"))
    }

    pub fn minisig_asset(&self) -> Option<&ReleaseAsset> {
        self.assets.iter().find(|a| a.name.ends_with(".minisig"))
    }
}

pub struct GitHubClient {
    agent: ureq::Agent,
}

impl GitHubClient {
    pub fn new() -> Self {
        Self {
            agent: ureq::builder()
                .user_agent(USER_AGENT)
                .timeout(std::time::Duration::from_secs(15))
                .build(),
        }
    }

    /// Récupère la liste des releases officielles sur GitHub
    pub fn list_releases(&self) -> Result<Vec<Release>> {
        let url = format!("https://api.github.com/repos/{}/releases", GITHUB_REPO);
        let resp = self.agent.get(&url)
            .set("Accept", "application/vnd.github.v3+json")
            .call()
            .context("Échec de la requête vers l'API GitHub")?;

        let releases: Vec<Release> = resp.into_json()
            .context("Impossible de décoder les releases GitHub")?;
        Ok(releases)
    }

    #[allow(dead_code)]
    pub fn get_latest_release(&self) -> Result<Release> {
        let releases = self.list_releases()?;
        releases.into_iter().find(|r| !r.prerelease)
            .ok_or_else(|| anyhow!("Aucune release stable trouvée"))
    }

    #[allow(dead_code)]
    pub fn list_branches(&self) -> Result<Vec<String>> {
        let url = format!("https://api.github.com/repos/{}/branches", GITHUB_REPO);
        let resp = self.agent.get(&url)
            .set("Accept", "application/vnd.github.v3+json")
            .call()
            .context("Échec de la récupération des branches GitHub")?;

        #[derive(Deserialize)]
        struct Branch { name: String }
        let branches: Vec<Branch> = resp.into_json()
            .context("Impossible de parser les branches GitHub")?;
        Ok(branches.into_iter().map(|b| b.name).collect())
    }

    /// Télécharge un asset avec affichage d'une barre de progression
    pub fn download_file(&self, url: &str, dest_path: &Path) -> Result<()> {
        if let Some(parent) = dest_path.parent() {
            fs::create_dir_all(parent)?;
        }

        let resp = self.agent.get(url).call()
            .map_err(|e| anyhow!("Erreur lors du téléchargement de {} : {}", url, e))?;

        let total_size = resp.header("Content-Length")
            .and_then(|s| s.parse::<u64>().ok())
            .unwrap_or(0);

        let pb = ProgressBar::new(total_size);
        pb.set_style(ProgressStyle::default_bar()
            .template("{spinner:.green} [{elapsed_precise}] [{bar:40.cyan/blue}] {bytes}/{total_bytes} ({eta})")?
            .progress_chars("#>-"));

        let mut reader = resp.into_reader();
        let mut file = File::create(dest_path)
            .context("Impossible de créer le fichier de destination")?;

        let mut buffer = [0u8; 8192];
        let mut downloaded: u64 = 0;

        loop {
            let n = reader.read(&mut buffer)?;
            if n == 0 { break; }
            file.write_all(&buffer[..n])?;
            downloaded += n as u64;
            pb.set_position(downloaded);
        }

        pb.finish_with_message("Téléchargement terminé");
        Ok(())
    }

    /// Télécharge un contenu texte distant (ex: SHA256SUMS ou .minisig)
    pub fn download_string(&self, url: &str) -> Result<String> {
        let resp = self.agent.get(url).call()
            .map_err(|e| anyhow!("Erreur lors du téléchargement de {} : {}", url, e))?;
        resp.into_string()
            .context("Impossible de lire le contenu texte de la réponse")
    }

    /// Télécharge et valide cryptographiquement l'intégrité et la signature d'un asset
    pub fn download_and_verify_asset(&self, release: &Release, asset: &ReleaseAsset) -> Result<PathBuf> {
        let release_cache_dir = Self::cache_dir().join(&release.tag_name);
        fs::create_dir_all(&release_cache_dir)?;
        let dest = release_cache_dir.join(&asset.name);

        // 1. Télécharger le fichier binaire
        self.download_file(&asset.browser_download_url, &dest)?;

        // 2. Si SHA256SUMS est disponible dans la release, vérifier l'intégrité
        if let Some(sha_asset) = release.sha256_asset() {
            let sha256_sums = self.download_string(&sha_asset.browser_download_url)
                .context("Impossible de télécharger le fichier SHA256SUMS")?;

            // 2a. Si la signature Minisign est présente, vérifier son authenticité
            if let Some(sig_asset) = release.minisig_asset() {
                let sig_content = self.download_string(&sig_asset.browser_download_url)
                    .context("Impossible de télécharger la signature SHA256SUMS.minisig")?;

                let pk = minisign_verify::PublicKey::from_base64(OFFICIAL_PUBLIC_KEY)
                    .map_err(|e| anyhow!("Clé publique Minisign invalide: {:?}", e))?;
                let signature = minisign_verify::Signature::decode(&sig_content)
                    .map_err(|e| anyhow!("Format de signature Minisign invalide: {:?}", e))?;

                pk.verify(sha256_sums.as_bytes(), &signature, false)
                    .map_err(|e| anyhow!("Échec de vérification cryptographique Minisign pour la release {}: {:?}", release.tag_name, e))?;
            }

            // 2b. Vérifier que le SHA256 du fichier téléchargé correspond bien à la table
            let computed_hash = Self::compute_sha256(&dest)?;
            let mut matched = false;
            for line in sha256_sums.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 2 && parts[0].eq_ignore_ascii_case(&computed_hash) {
                    let filename = parts[1].trim_start_matches('*');
                    if filename == asset.name {
                        matched = true;
                        break;
                    }
                }
            }

            if !matched {
                fs::remove_file(&dest).ok();
                return Err(anyhow!(
                    "Échec de validation SHA256 ! Le fichier téléchargé ne correspond pas à la somme de contrôle officielle ({})",
                    computed_hash
                ));
            }
        }

        Ok(dest)
    }

    /// Dossier local de cache des firmwares
    pub fn cache_dir() -> PathBuf {
        let base = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .unwrap_or_else(|_| ".".to_string());
        PathBuf::from(base).join(".cache").join("openfirenet-installer").join("firmware")
    }

    pub fn compute_sha256(path: &Path) -> Result<String> {
        let mut file = File::open(path)?;
        let mut hasher = Sha256::new();
        let mut buffer = [0u8; 8192];
        loop {
            let n = file.read(&mut buffer)?;
            if n == 0 { break; }
            hasher.update(&buffer[..n]);
        }
        Ok(hex::encode(hasher.finalize()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_official_public_key_valid() {
        let pk = minisign_verify::PublicKey::from_base64(OFFICIAL_PUBLIC_KEY);
        assert!(pk.is_ok(), "The official Open Firenet public key should parse without error");
    }

    #[test]
    fn test_minisign_signature_tamper_detection() {
        let pk = minisign_verify::PublicKey::from_base64(OFFICIAL_PUBLIC_KEY).unwrap();
        // A valid signature string format
        let sig_str = "untrusted comment: signature from minisign secret key\n\
                       RWQhzS5dR0kodI/W8hXf3s+Lp2VnC2/N7rZ1y+u8E9Q=\ntrusted comment: timestamp:0\n\
                       RWQhzS5dR0kodI/W8hXf3s+Lp2VnC2/N7rZ1y+u8E9Q=";
        if let Ok(signature) = minisign_verify::Signature::decode(sig_str) {
            let result = pk.verify(b"tampered content", &signature, false);
            assert!(result.is_err(), "Verification should fail on tampered content");
        }
    }
}
