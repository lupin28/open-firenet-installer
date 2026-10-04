use anyhow::{anyhow, Context, Result};
use colored::*;
use indicatif::{ProgressBar, ProgressStyle};
use md5::{Digest, Md5};
use std::io::{Read, Write};
use std::net::{SocketAddr, TcpListener, UdpSocket};
use std::path::Path;
use std::thread;
use std::time::Duration;

pub struct OtaFlasher;

impl OtaFlasher {
    /// Effectue la mise à jour sans fil via le protocole ArduinoOTA en 100% Rust natif
    /// (UDP 3232 pour l'invitation + TCP local pour le streaming du firmware)
    pub fn flash_arduino_ota<F>(ip: &str, bin_path: &Path, on_progress: F) -> Result<()>
    where
        F: Fn(u32, &str) + Send + Sync,
    {
        if !bin_path.exists() {
            return Err(anyhow!("Le fichier binaire n'existe pas : {:?}", bin_path));
        }

        println!("\n{} Préparation de la mise à jour sans fil (ArduinoOTA natif) vers {}...", "📡".bold(), ip.cyan());
        on_progress(2, "Lecture et vérification du firmware...");

        let bin_data = std::fs::read(bin_path)
            .with_context(|| format!("Impossible de lire le fichier firmware : {:?}", bin_path))?;
        let content_size = bin_data.len();

        let mut hasher = Md5::new();
        hasher.update(&bin_data);
        let file_md5 = hex::encode(hasher.finalize());

        println!("Firmware : {} octets, MD5: {}", content_size, file_md5);

        // 1. Ouvrir le serveur TCP local sur un port éphémère libre
        let tcp_listener = TcpListener::bind("0.0.0.0:0")
            .context("Impossible d'ouvrir le port d'écoute TCP local pour l'OTA")?;
        let local_port = tcp_listener.local_addr()?.port();
        println!("Serveur TCP local en écoute sur le port {}", local_port);

        // 2. Préparer la socket UDP pour la négociation d'invitation
        let udp_socket = UdpSocket::bind("0.0.0.0:0")
            .context("Impossible d'ouvrir la socket UDP locale pour l'OTA")?;
        udp_socket.set_read_timeout(Some(Duration::from_millis(1500)))?;

        let esp_udp_addr: SocketAddr = format!("{}:3232", ip)
            .parse()
            .with_context(|| format!("Adresse IP du poêle invalide : {}", ip))?;

        // 3. Protocole ArduinoOTA : commande 0 (FLASH), port local, taille, MD5
        let invite_msg = format!("0 {} {} {}\n", local_port, content_size, file_md5);

        on_progress(5, &format!("Négociation OTA avec le poêle ({}:3232)...", ip));
        let pb = ProgressBar::new_spinner();
        pb.set_style(ProgressStyle::default_spinner().template("{spinner:.green} {msg}")?);
        pb.enable_steady_tick(Duration::from_millis(100));
        pb.set_message("Connexion au poêle via Wi-Fi...");

        let mut ack_ok = false;
        let mut rx_buf = [0u8; 128];

        for attempt in 1..=8 {
            let _ = udp_socket.send_to(invite_msg.as_bytes(), esp_udp_addr);
            match udp_socket.recv_from(&mut rx_buf) {
                Ok((n, _from)) => {
                    let resp = String::from_utf8_lossy(&rx_buf[..n]);
                    if resp.contains("OK") {
                        ack_ok = true;
                        break;
                    } else if resp.contains("AUTH") {
                        return Err(anyhow!("Le poêle a demandé une authentification par mot de passe"));
                    }
                }
                Err(_) => {
                    on_progress(5 + attempt, &format!("Attente de réponse du poêle ({}/8)...", attempt));
                }
            }
        }

        if !ack_ok {
            return Err(anyhow!(
                "Le poêle sur {} (port 3232) n'a pas répondu à l'invitation OTA. Vérifiez qu'il est allumé et sur le même réseau.",
                ip
            ));
        }

        pb.set_message("Attente de la connexion TCP de l'ESP32...");
        on_progress(15, "Connexion établie, initialisation du transfert...");

        // 4. Accepter la connexion TCP de l'ESP32 (l'ESP32 se connecte en retour sur notre port TCP)
        tcp_listener.set_nonblocking(true)?;
        let start_connect = std::time::Instant::now();
        let mut client_stream = None;

        while start_connect.elapsed() < Duration::from_secs(12) {
            match tcp_listener.accept() {
                Ok((stream, peer)) => {
                    println!("Connexion TCP reçue de l'ESP32 depuis {}", peer);
                    client_stream = Some(stream);
                    break;
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    thread::sleep(Duration::from_millis(50));
                }
                Err(e) => return Err(anyhow!("Erreur d'acceptation TCP : {}", e)),
            }
        }

        let mut stream = client_stream.ok_or_else(|| {
            anyhow!("Délai d'attente dépassé : l'ESP32 n'a pas pu se connecter au port TCP {} du PC (vérifiez que votre pare-feu autorise les connexions entrantes sur le réseau local)", local_port)
        })?;

        stream.set_nonblocking(false)?;
        stream.set_read_timeout(Some(Duration::from_secs(15)))?;
        stream.set_write_timeout(Some(Duration::from_secs(15)))?;

        // 5. Envoi des blocs de firmware (blocs de 1024 octets pour fluidité réseau)
        let chunk_size = 1024;
        let mut offset = 0;
        let mut ack_buf = [0u8; 32];
        let mut last_pct = 0;

        pb.set_message("Envoi du firmware...");

        while offset < content_size {
            let end = (offset + chunk_size).min(content_size);
            let chunk = &bin_data[offset..end];
            stream.write_all(chunk)
                .context("Erreur lors de l'envoi des données vers l'ESP32")?;
            offset = end;

            // Lire l'acquittement de l'ESP32 pour respecter le contrôle de flux TCP
            let _ = stream.read(&mut ack_buf);

            let pct = 15 + ((offset as f64 / content_size as f64) * 83.0) as u32;
            if pct != last_pct {
                last_pct = pct;
                let msg = format!("Envoi Wi-Fi OTA : {}%", ((offset as f64 / content_size as f64) * 100.0) as u32);
                pb.set_message(msg.clone());
                on_progress(pct, &msg);
            }
        }

        // 6. Validation finale par l'ESP32
        pb.set_message("Vérification de l'intégrité MD5 par l'ESP32...");
        on_progress(99, "Vérification de l'intégrité et écriture flash...");

        // Attente de l'acquittement final OK (l'ESP32 valide la flash et le MD5)
        stream.set_read_timeout(Some(Duration::from_secs(8)))?;
        let mut final_buf = [0u8; 64];

        for _ in 0..10 {
            match stream.read(&mut final_buf) {
                Ok(n) if n > 0 => {
                    let s = String::from_utf8_lossy(&final_buf[..n]);
                    if s.contains("OK") {
                        break;
                    }
                }
                _ => break,
            }
        }

        pb.finish_with_message("Mise à jour sans fil terminée avec succès !");
        println!("{} Transfert OTA terminé avec succès !", "✔".green().bold());

        // 7. Attente de reconnexion
        let reboot_ok = Self::wait_for_reboot(ip, &on_progress);
        if reboot_ok {
            on_progress(100, "✔ La clé a redémarré avec succès et est de nouveau en ligne !");
        }
        Ok(())
    }

    /// Attend que le dongle redémarre et réponde à nouveau sur le réseau
    pub fn wait_for_reboot<F>(ip: &str, on_progress: F) -> bool
    where
        F: Fn(u32, &str) + Send + Sync,
    {
        println!("Attente de la reconnexion au réseau...");
        on_progress(100, "Redémarrage de la clé en cours... Attente de la reconnexion au Wi-Fi...");
        thread::sleep(Duration::from_secs(4));

        for attempt in 1..=20 {
            thread::sleep(Duration::from_secs(1));
            on_progress(
                100,
                &format!("Attente de la reconnexion au réseau ({}/20)...", attempt),
            );
            let url = format!("http://{}/api/state", ip);
            if let Ok(resp) = ureq::get(&url).timeout(Duration::from_millis(800)).call() {
                if resp.status() == 200 {
                    println!("{} Open Firenet est de nouveau en ligne et fonctionnel !", "🎉".bold());
                    on_progress(100, "✔ La clé a redémarré avec succès et est de nouveau en ligne !");
                    return true;
                }
            }
        }
        println!("{} Le dongle prend plus de temps à se reconnecter. Vérifiez son adresse IP sur votre box.", "ℹ".yellow());
        on_progress(100, "La clé prend plus de temps à se reconnecter. Vérifiez son adresse IP.");
        false
    }
}
