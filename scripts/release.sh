#!/usr/bin/env bash
# ==============================================================================
# Open Firenet Installer Release Script
#
# Automatise le processus de release avec garde-fous stricts :
# 1. Vérification de la propreté du git tree
# 2. Vérification de la branche (main) et synchronisation remote
# 3. Exécution obligatoire des tests unitaires Rust & build frontend
# 4. Calcul automatique SemVer (patch / minor / major)
# 5. Création et push du tag annoté pour déclencher la CI Release
# ==============================================================================

set -eo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}ℹ${NC} $*"; }
ok()    { echo -e "${GREEN}✔${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
err()   { echo -e "${RED}✖${NC} $*" >&2; }
fatal() { err "$*"; exit 1; }

# Trouver la racine du dépôt git
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  fatal "Ce script doit être exécuté dans un dépôt Git."
fi
cd "$REPO_ROOT"

echo -e "\n${BOLD}${CYAN}=== Open Firenet Installer Release Assistant ===${NC}\n"

# 1. Vérification de la propreté de l'arbre de travail
info "Vérification de l'état de l'arbre de travail Git..."
if [[ -n "$(git status --porcelain)" ]]; then
  fatal "L'arbre de travail n'est pas propre. Veuillez commiter ou remiser vos modifications avant de releaser."
fi
ok "Arbre de travail propre."

# 2. Vérification de la branche
CURRENT_BRANCH="$(git branch --show-current)"
info "Branche actuelle : ${BOLD}${CURRENT_BRANCH}${NC}"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  warn "Vous n'êtes pas sur la branche 'main' (branche actuelle: $CURRENT_BRANCH)."
  read -rp "Voulez-vous vraiment créer une release depuis '$CURRENT_BRANCH' ? [o/N] " confirm_branch
  if [[ ! "$confirm_branch" =~ ^[oOyY]$ ]]; then
    fatal "Release annulée. Basculez sur 'main' avec : git checkout main"
  fi
fi

# 3. Synchronisation avec origin
info "Vérification de la synchronisation avec origin..."
git fetch origin "$CURRENT_BRANCH" --quiet || true
LOCAL_COMMIT="$(git rev-parse HEAD)"
REMOTE_COMMIT="$(git rev-parse "origin/$CURRENT_BRANCH" 2>/dev/null || true)"

if [[ -n "$REMOTE_COMMIT" && "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]]; then
  BEHIND="$(git rev-list --count HEAD..origin/"$CURRENT_BRANCH" 2>/dev/null || echo 0)"
  if [[ "$BEHIND" -gt 0 ]]; then
    fatal "Votre branche locale a $BEHIND commit(s) de retard par rapport à origin. Faites un 'git pull' d'abord."
  fi
fi
ok "Synchronisation remote vérifiée."

# 4. Exécution obligatoire des tests et build frontend
info "Validation du build frontend..."
npm run build >/dev/null 2>&1 || fatal "Le build frontend (npm run build) a échoué !"
ok "Frontend build validé."

info "Exécution des tests unitaires Rust..."
cargo test >/dev/null 2>&1 || fatal "Les tests unitaires Rust ont échoué !"
ok "Tests unitaires validés."

# 5. Détection du dernier tag et calcul SemVer
LATEST_TAG="$(git describe --tags --abbrev=0 2>/dev/null || true)"

if [[ -z "$LATEST_TAG" ]]; then
  warn "Aucun tag existant trouvé dans ce dépôt."
  DEFAULT_NEXT="v1.0.0"
  LATEST_TAG="aucun"
else
  info "Dernier tag détecté : ${BOLD}${LATEST_TAG}${NC}"
  RAW_VER="${LATEST_TAG#v}"
  IFS='.' read -r MAJOR MINOR PATCH <<< "$RAW_VER"
  
  NEXT_PATCH="v${MAJOR}.${MINOR}.$((PATCH + 1))"
  NEXT_MINOR="v${MAJOR}.$((MINOR + 1)).0"
  NEXT_MAJOR="v$((MAJOR + 1)).0.0"

  # Analyse automatique de l'historique des commits (Conventional Commits)
  COMMITS_LOG="$(git log "${LATEST_TAG}..HEAD" --pretty=format:"%s%n%b" 2>/dev/null || true)"
  FEAT_COUNT="$(echo "$COMMITS_LOG" | grep -ciE "^feat(\([a-z0-9_-]+\))?:" || true)"
  FIX_COUNT="$(echo "$COMMITS_LOG" | grep -ciE "^fix(\([a-z0-9_-]+\))?:" || true)"
  BREAKING_COUNT="$(echo "$COMMITS_LOG" | grep -ciE "(BREAKING CHANGE|BREAKING-CHANGE|^[a-z]+(\([a-z0-9_-]+\))?!:)" || true)"

  echo -e "\n${BOLD}Analyse des commits depuis ${LATEST_TAG} (Conventional Commits) :${NC}"
  echo -e "  • ${CYAN}${FEAT_COUNT}${NC} nouvelle(s) fonctionnalité(s) (feat)"
  echo -e "  • ${CYAN}${FIX_COUNT}${NC} correction(s) de bug (fix)"
  echo -e "  • ${CYAN}${BREAKING_COUNT}${NC} rupture(s) de compatibilité (breaking change)"

  if [[ "$BREAKING_COUNT" -gt 0 ]]; then
    SUGGESTED_BUMP="major"
    DEFAULT_NEXT="$NEXT_MAJOR"
    BUMP_REASON="Rupture de compatibilité détectée (BREAKING CHANGE)"
    RECOMMENDED_CHOICE="3"
  elif [[ "$FEAT_COUNT" -gt 0 ]]; then
    SUGGESTED_BUMP="minor"
    DEFAULT_NEXT="$NEXT_MINOR"
    BUMP_REASON="Nouvelle fonctionnalité détectée (feat)"
    RECOMMENDED_CHOICE="2"
  else
    SUGGESTED_BUMP="patch"
    DEFAULT_NEXT="$NEXT_PATCH"
    BUMP_REASON="Corrections (fix) ou maintenance sans nouvelle fonctionnalité"
    RECOMMENDED_CHOICE="1"
  fi

  echo -e "  👉 Recommandation automatique : ${GREEN}${BOLD}${SUGGESTED_BUMP^^} (${DEFAULT_NEXT})${NC} [${BUMP_REASON}]"
fi

TARGET_VERSION=""
ARG_INPUT="${1:-}"

if [[ -n "$ARG_INPUT" ]]; then
  case "$ARG_INPUT" in
    auto)  TARGET_VERSION="$DEFAULT_NEXT" ;;
    patch) TARGET_VERSION="$NEXT_PATCH" ;;
    minor) TARGET_VERSION="$NEXT_MINOR" ;;
    major) TARGET_VERSION="$NEXT_MAJOR" ;;
    v*.*.*) TARGET_VERSION="$ARG_INPUT" ;;
    *.*.*)  TARGET_VERSION="v$ARG_INPUT" ;;
    *) fatal "Argument invalide '$ARG_INPUT'. Utilisez: auto, patch, minor, major ou vX.Y.Z" ;;
  esac
else
  if [[ "$LATEST_TAG" == "aucun" ]]; then
    read -rp "Entrez la version initiale à releaser [défaut: $DEFAULT_NEXT]: " user_ver
    TARGET_VERSION="${user_ver:-$DEFAULT_NEXT}"
  else
    echo -e "\nOptions de version disponibles :"
    echo "  1) Patch : ${BOLD}${NEXT_PATCH}${NC}"
    echo "  2) Minor : ${BOLD}${NEXT_MINOR}${NC}"
    echo "  3) Major : ${BOLD}${NEXT_MAJOR}${NC}"
    echo "  4) Personnalisée"
    read -rp "Votre choix [1/2/3/4, Entrée = recommandé: $RECOMMENDED_CHOICE (${DEFAULT_NEXT})] : " choice
    case "$choice" in
      1) TARGET_VERSION="$NEXT_PATCH" ;;
      2) TARGET_VERSION="$NEXT_MINOR" ;;
      3) TARGET_VERSION="$NEXT_MAJOR" ;;
      4) read -rp "Entrez la version (ex: v1.2.3) : " TARGET_VERSION ;;
      "") TARGET_VERSION="$DEFAULT_NEXT" ;;
      *) TARGET_VERSION="$DEFAULT_NEXT" ;;
    esac
  fi
fi

[[ "$TARGET_VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || fatal "Format SemVer invalide: '$TARGET_VERSION' (attendu: vX.Y.Z)"

if git rev-parse "$TARGET_VERSION" >/dev/null 2>&1; then
  fatal "Le tag $TARGET_VERSION existe déjà dans le dépôt."
fi

# 6. Récapitulatif
echo -e "\n${BOLD}--- Récapitulatif de la release ---${NC}"
echo -e "Version précédente : ${YELLOW}${LATEST_TAG}${NC}"
echo -e "Version cible      : ${GREEN}${BOLD}${TARGET_VERSION}${NC}"
echo -e "Branche source     : ${BOLD}${CURRENT_BRANCH}${NC}"
echo -e "Dernier commit     : $(git log -1 --pretty=format:'%h - %s (%an)')"

echo -e "\n${YELLOW}⚠ Cette action va créer et pousser le tag '${TARGET_VERSION}' sur GitHub.${NC}"
read -rp "Confirmez-vous la publication de la release ${TARGET_VERSION} ? [o/N] " confirm
if [[ ! "$confirm" =~ ^[oOyY]$ ]]; then
  fatal "Publication annulée par l'utilisateur."
fi

# 7. Mise à jour automatique des fichiers de version
CLEAN_VER="${TARGET_VERSION#v}"
info "Mise à jour automatique des fichiers de version vers ${CLEAN_VER}..."

# 7.1 package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$CLEAN_VER';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
ok "package.json synchronisé (${CLEAN_VER})."

# 7.2 src-tauri/tauri.conf.json
node -e "
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json', 'utf8'));
conf.version = '$CLEAN_VER';
fs.writeFileSync('src-tauri/tauri.conf.json', JSON.stringify(conf, null, 2) + '\n');
"
ok "src-tauri/tauri.conf.json synchronisé (${CLEAN_VER})."

# 7.3 src-tauri/Cargo.toml
sed -i -E "s/^(version[[:space:]]*=[[:space:]]*)\"[^\"]+\"/\1\"$CLEAN_VER\"/" src-tauri/Cargo.toml
ok "src-tauri/Cargo.toml synchronisé (${CLEAN_VER})."

# 7.4 Rebuild frontend & synchronisation Cargo.lock
info "Reconstruction du frontend et synchronisation Cargo.lock..."
npm run build >/dev/null || fatal "Le build frontend (npm run build) a échoué après le bump de version !"
(cd src-tauri && cargo check --quiet 2>/dev/null || true)
ok "Build frontend et Cargo.lock synchronisés."

# 7.5 Commit automatique du bump de version
info "Commit automatique de la version ${TARGET_VERSION}..."
# Note: Cargo.lock lives at the repo root (not src-tauri/), and dist/ is gitignored
# (build output, not versioned) — do not add either, a single unmatched pathspec
# makes `git add` stage nothing at all, silently skipping the commit below.
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml Cargo.lock
if ! git diff --cached --quiet; then
  git commit -m "chore(release): bump version to ${TARGET_VERSION}" --author="openfirenet <openfirenet@lestang.net>"
  info "Push du commit sur origin/${CURRENT_BRANCH}..."
  git push origin "$CURRENT_BRANCH"
  ok "Commit de version poussé sur origin."
else
  ok "Fichiers de version déjà à jour."
fi

# 8. Création et push du tag
info "Création du tag annoté '${TARGET_VERSION}'..."
git tag -a "$TARGET_VERSION" -m "Release $TARGET_VERSION"
ok "Tag créé localement."

info "Push du tag sur origin..."
git push origin "$TARGET_VERSION"
ok "Tag poussé sur GitHub !"

echo -e "\n${BOLD}${GREEN}✔ Release ${TARGET_VERSION} déclenchée avec succès !${NC}"
echo -e "Suivez la compilation et la signature sur : ${CYAN}https://github.com/openfirenet/open-firenet-installer/actions${NC}\n"
