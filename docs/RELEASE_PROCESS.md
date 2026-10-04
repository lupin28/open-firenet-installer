# Processus d'Intégration Continue (CI) et de Release — Open Firenet Installer

Ce document décrit le pipeline d'intégration continue, les tests de validation (smoke tests) des binaires produits, la signature cryptographique Minisign, et la procédure de release automatisée de l'**Installeur Open Firenet**.

---

## 1. Pipeline CI (sur chaque commit & PR)

Le workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) est déclenché automatiquement sur :
- Tout `push` sur les branches `main`, `feat/**`, `fix/**`
- Toute `pull_request` vers `main`

### Étapes exécutées :
1. **Frontend Check** (`npm run build`) :
   - Vérifie la compilation TypeScript / JavaScript et l'absence d'erreurs de bundling Vite.
2. **Rust Tests & Formatting** (`cargo test`) :
   - Compile et exécute les tests unitaires du backend Tauri en Rust.
3. **Cross-Compilation & Smoke Tests** :
   - Compile l'application sur les 4 cibles :
     - Linux x86_64 (`x86_64-unknown-linux-gnu`)
     - Windows x86_64 (`x86_64-pc-windows-msvc`)
     - macOS Apple Silicon (`aarch64-apple-darwin`)
     - macOS Intel (`x86_64-apple-darwin`)
   - **Validation approfondie des binaires produits (Sanity & Smoke Tests)** :
     - Vérification de l'existence et de la taille minimale (> 2 Mo).
     - Vérification du format binaire (`ELF 64-bit`, `PE32+`, `Mach-O`).
     - **Test d'exécution réelle** : Exécution de `./open-firenet-installer --version` et `--help` pour garantir qu'aucune dépendance dynamique manquante ou régression ne crash au lancement.
     - Calcul des empreintes SHA256.

---

## 2. Processus de Release Sécurisé (Tag-driven)

Le workflow [`.github/workflows/release.yml`](../.github/workflows/release.yml) est déclenché lors du push d'un tag au format `v*` (ex. `v0.1.0`).

### Artefacts produits :
* `open-firenet-installer-linux-x86_64` : exécutable autonome Linux.
* `open-firenet-installer-windows-x86_64.exe` : exécutable Windows.
* `open-firenet-installer-macos-arm64` : exécutable macOS Apple Silicon (M1/M2/M3/M4).
* `open-firenet-installer-macos-x86_64` : exécutable macOS processeurs Intel.
* `SHA256SUMS` : condensats cryptographiques de tous les exécutables.
* `SHA256SUMS.minisig` : signature cryptographique Minisign Ed25519.

### Sécurité & Traçabilité (Supply Chain Security) :
1. **Signature Minisign (Ed25519)** :
   - `SHA256SUMS` est signé avec la clé privée `MINISIGN_SECRET_KEY` stockée dans les secrets GitHub du dépôt.
   - La clé publique est stockée dans [`minisign.pub`](../minisign.pub).
2. **Attestation SLSA Level 3 (GitHub Artifact Attestations)** :
   - Attestation cryptographique native émise par GitHub via OIDC et Sigstore garantissant l'origine du code source.

---

## 3. Déclencher une Release (Assistant local)

Pour créer et publier une release de l'installeur, lancez simplement :

```bash
# Release initiale v0.1.0 ou incrément automatique
./scripts/release.sh

# Incrément spécifique
./scripts/release.sh patch   # ex: v0.1.0 -> v0.1.1
./scripts/release.sh minor   # ex: v0.1.0 -> v0.2.0
./scripts/release.sh major   # ex: v0.1.0 -> v1.0.0
```
