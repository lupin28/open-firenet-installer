export const translations = {
  fr: {
    // Header
    appTitle: "Open Firenet",
    appTitleSuffix: "Installer",
    appSubtitle: "Assistant universel d'installation & mise à jour",
    statusReady: "Prêt",
    statusSearching: "Recherche sur le réseau...",
    statusNotFound: "Aucun poêle trouvé",
    statusFound: "Poêle détecté",
    statusError: "Erreur de scan",
    statusFlashingUsb: "Flashage USB en cours...",
    statusFlashingSuccess: "Flashage terminé avec succès !",
    statusOtaWaiting: "En attente...",
    statusOtaSending: "Envoi du firmware via Wi-Fi...",
    statusOtaSuccess: "Mise à jour réussie ! La clé redémarre.",
    statusOtaReconnecting: "Attente du redémarrage et reconnexion au réseau...",
    statusOtaOnline: "La clé a redémarré avec succès et est en ligne !",
    otaSuccessOnline: "Mise à jour OTA réussie ! La clé a redémarré et est de nouveau en ligne.",

    // Tabs
    tabDiscovery: "Détection Réseau",
    tabOta: "Mise à jour Wi-Fi",
    tabUsb: "Flash USB",
    tabWifi: "Config Wi-Fi",
    tabReleases: "Releases",

    // Discovery Tab
    discoveryTitle: "Détection automatique de votre poêle",
    discoveryDesc: "Recherche votre poêle Open Firenet via mDNS (openfirenet.local) et sur votre réseau local.",
    btnScanInProgress: "Recherche en cours...",
    btnScan: "Rechercher",
    scanLoadingTitle: "Recherche du poêle sur le réseau local...",
    scanLoadingDesc: "Détection mDNS et sonde du sous-réseau en cours...",
    emptyDevicesTitle: "Aucun poêle Open Firenet détecté",
    emptyDevicesDesc: "Vérifiez que votre clé est allumée et connectée au même réseau Wi-Fi que cet ordinateur.",
    emptyBtnWifiSetup: "Configurer le Wi-Fi via USB",
    emptyBtnRetryScan: "Relancer la recherche",

    // Single Device Card
    stoveOnline: "En ligne / Connecté",
    stoveStandby: "En veille / Connecté",
    stoveModelDefault: "Poêle RIKA",
    labelIp: "Adresse IP",
    labelHostname: "Nom d'hôte",
    labelFirmware: "Version Firmware",
    versionUnknown: "Inconnue",
    labelWifiSignal: "Signal Wi-Fi",
    btnOpenWeb: "Ouvrir l'interface Web",
    btnUpdateOta: "Mettre à jour via Wi-Fi",

    // OTA Tab
    otaTitle: "Mise à jour sans fil (OTA)",
    otaDesc: "Mettez à jour le firmware de votre poêle à distance via votre réseau Wi-Fi.",
    labelOtaIp: "Adresse IP du poêle :",
    btnUseDetectedIp: "Utiliser l'IP détectée",
    placeholderOtaIp: "Ex: 192.168.1.93 ou openfirenet.local",
    labelOtaRelease: "Version du firmware à installer :",
    loadingReleases: "Chargement des versions officielles...",
    labelLocalFile: "Fichier binaire local (.bin) :",
    labelFirmwareSource: "Source du firmware :",
    sourceRelease: "Release officielle",
    sourceLocalFile: "Fichier local",
    btnBrowseFile: "Parcourir…",
    btnStartOta: "Lancer la mise à jour OTA",
    otaSuccessMsg: "Mise à jour réussie ! La clé redémarre.",

    // USB Tab
    usbTitle: "Flashage USB Série",
    usbDesc: "Idéal pour le premier flash d'un ESP32-S3 neuf ou une réinstallation complète.",
    btnRefreshPorts: "Actualiser les ports",
    labelUsbPort: "Port USB Série connecté :",
    detectingPorts: "Détection des ports en cours...",
    noPortDetected: "Aucun port série détecté (branchez votre clé en USB)",
    labelUsbMode: "Type d'opération USB :",
    usbModeUpdateTitle: "Mise à jour (Conserver la config)",
    usbModeUpdateDesc: "Préserve vos identifiants Wi-Fi et paramètres NVS",
    usbModeFactoryTitle: "Reset complet (Image Usine)",
    usbModeFactoryDesc: "Écrase toute la mémoire flash (reconfiguration requise)",
    labelUsbRelease: "Version du firmware :",
    labelUsbLocalFile: "Binaire factory local (.bin) :",
    btnStartUsbFlash: "Flasher la clé USB",
    flashingInProgress: "Flashage en cours...",
    usbNativeHintTitle: "Cartes à USB natif (M5Stamp S3, XIAO ESP32-S3) :",
    usbNativeHintDesc: "Si la connexion échoue, maintenez le bouton BOOT enfoncé lors du branchement USB. Après le flashage, appuyez sur le bouton RESET pour démarrer.",

    // Wi-Fi Config Tab
    wifiTitle: "Configuration Wi-Fi de la clé",
    wifiDesc: "Transmettez le nom de votre box Wi-Fi (SSID) et sa clé de sécurité via la liaison USB.",
    labelWifiPort: "Port USB de la clé :",
    selectPort: "Sélectionnez un port...",
    labelWifiSsid: "Nom du réseau Wi-Fi (SSID) :",
    labelWifiPass: "Mot de passe Wi-Fi :",
    btnSendWifi: "Enregistrer le Wi-Fi dans la clé",
    wifiConfigSuccess: "Identifiants Wi-Fi envoyés ! La clé tente la connexion...",
    wifiNativeHintTitle: "Astuce Wi-Fi :",
    wifiNativeHintDesc: "Sur les cartes sans puce UART dédiée, vous pouvez aussi configurer le Wi-Fi en vous connectant au point d'accès « Open-Firenet-Setup » (192.168.4.1).",

    // Releases Tab
    releasesTitle: "Versions officielles Open Firenet",
    releasesDesc: "Historique des publications officielles sur GitHub vérifiées par Minisign.",
    btnRefreshReleases: "Recharger",
    checkingReleases: "Interrogation de GitHub...",
    checkingReleasesDesc: "Vérification des versions officielles sur openfirenet/open-firenet...",
    badgeStable: "Stable",
    badgePrerelease: "Pré-release",
    availableFiles: "Fichiers & signatures :",
    viewOnGithub: "Voir sur GitHub",
    showNotes: "Voir les notes",
    hideNotes: "Masquer les notes",
    useForOta: "Installer via Wi-Fi (OTA)",
    useForUsb: "Installer via Flash USB",
    noReleaseTitle: "Aucune version officielle trouvée",
    noReleaseDesc: "Vous pouvez flasher ou mettre à jour directement votre clé à l'aide d'un fichier .bin local.",

    // Modal confirmation flash USB & OTA
    modalConfirmTitle: "Confirmation du flashage USB",
    modalConfirmDesc: "Vous êtes sur le point d'écrire le firmware sur la clé Open Firenet. Veuillez vérifier les paramètres :",
    modalTargetPort: "Port USB cible :",
    modalTargetVersion: "Firmware :",
    modalConfirmWarning: "Attention : cette opération va écrire sur la mémoire flash de l'ESP32. Ne débranchez pas la clé pendant l'opération !",
    modalConfirmWarningFactory: "Attention : cette opération va réinitialiser l'ensemble de la mémoire flash. La configuration Wi-Fi devra être réenregistrée !",
    modalBtnCancel: "Annuler",
    modalBtnConfirm: "Confirmer et flasher",

    modalOtaConfirmTitle: "Confirmation de la mise à jour sans fil (OTA)",
    modalOtaConfirmDesc: "Vous êtes sur le point de mettre à jour votre clé Open Firenet via le réseau Wi-Fi :",
    modalTargetIp: "Adresse IP cible :",
    modalOtaConfirmWarning: "Attention : assurez-vous que le poêle et la clé restent allumés pendant le transfert. Ne coupez pas l'alimentation !",
    modalOtaBtnConfirm: "Confirmer et mettre à jour",

    // Footer & Alerts
    footerTagline: "Open Firenet Installer • Open-Source & Sans Télémétrie",
    footerNoStove: "Aucun poêle connecté",
    footerStoveActive: "Poêle actif :",
    alertFillIp: "Veuillez renseigner l'adresse IP du poêle.",
    alertSelectVersionOrFile: "Veuillez sélectionner une version ou un fichier binaire local.",
    alertSelectPort: "Veuillez sélectionner un port USB.",
    alertSelectWifiPort: "Veuillez sélectionner le port USB de la clé.",
    alertFillSsid: "Veuillez saisir le nom de votre réseau Wi-Fi (SSID).",
    alertNoStoveDetected: "Aucun poêle détecté sur le réseau pour le moment. Lancez une recherche d'abord.",
    alertErrorPrefix: "Erreur :"
  },

  en: {
    // Header
    appTitle: "Open Firenet",
    appTitleSuffix: "Installer",
    appSubtitle: "Universal installation & update assistant",
    statusReady: "Ready",
    statusSearching: "Scanning network...",
    statusNotFound: "No stove found",
    statusFound: "Stove detected",
    statusError: "Scan error",
    statusFlashingUsb: "Flashing USB device...",
    statusFlashingSuccess: "Flashing completed successfully!",
    statusOtaWaiting: "Waiting...",
    statusOtaSending: "Sending firmware over Wi-Fi...",
    statusOtaSuccess: "Update successful! The dongle is restarting.",
    statusOtaReconnecting: "Waiting for restart and network reconnection...",
    statusOtaOnline: "The dongle restarted successfully and is back online!",
    otaSuccessOnline: "OTA update successful! The dongle restarted and is back online.",

    // Tabs
    tabDiscovery: "Network Scan",
    tabOta: "Wi-Fi Update",
    tabUsb: "USB Flash",
    tabWifi: "Wi-Fi Setup",
    tabReleases: "Releases",

    // Discovery Tab
    discoveryTitle: "Automatic Stove Discovery",
    discoveryDesc: "Discovers your Open Firenet stove via mDNS (openfirenet.local) and your local network subnet.",
    btnScanInProgress: "Scanning...",
    btnScan: "Search",
    scanLoadingTitle: "Searching for stove on local network...",
    scanLoadingDesc: "Probing mDNS and local subnet in progress...",
    emptyDevicesTitle: "No Open Firenet stove detected",
    emptyDevicesDesc: "Ensure your dongle is powered on and connected to the same Wi-Fi network as this computer.",
    emptyBtnWifiSetup: "Configure Wi-Fi via USB",
    emptyBtnRetryScan: "Scan Again",

    // Single Device Card
    stoveOnline: "Online / Connected",
    stoveStandby: "Standby / Connected",
    stoveModelDefault: "RIKA Stove",
    labelIp: "IP Address",
    labelHostname: "Hostname",
    labelFirmware: "Firmware Version",
    versionUnknown: "Unknown",
    labelWifiSignal: "Wi-Fi Signal",
    btnOpenWeb: "Open Web Dashboard",
    btnUpdateOta: "Update via Wi-Fi",

    // OTA Tab
    otaTitle: "Wireless Update (OTA)",
    otaDesc: "Remotely update your stove firmware over your local Wi-Fi network.",
    labelOtaIp: "Stove IP Address:",
    btnUseDetectedIp: "Use Detected IP",
    placeholderOtaIp: "E.g., 192.168.1.93 or openfirenet.local",
    labelOtaRelease: "Firmware version to install:",
    loadingReleases: "Loading official releases...",
    labelLocalFile: "Local binary file (.bin):",
    labelFirmwareSource: "Firmware source:",
    sourceRelease: "Official release",
    sourceLocalFile: "Local file",
    btnBrowseFile: "Browse…",
    btnStartOta: "Start OTA Update",
    otaSuccessMsg: "Update successful! The dongle is restarting.",

    // USB Tab
    usbTitle: "USB Serial Flasher",
    usbDesc: "Ideal for first-time flashing of a fresh ESP32-S3 or complete reinstallation.",
    btnRefreshPorts: "Refresh Ports",
    labelUsbPort: "Connected USB Serial Port:",
    detectingPorts: "Detecting serial ports...",
    noPortDetected: "No serial port detected (plug your dongle into USB)",
    labelUsbMode: "USB Operation Type:",
    usbModeUpdateTitle: "Update (Keep Configuration)",
    usbModeUpdateDesc: "Preserves Wi-Fi credentials and NVS settings",
    usbModeFactoryTitle: "Full Reset (Factory Image)",
    usbModeFactoryDesc: "Overwrites entire flash memory (Wi-Fi setup required)",
    labelUsbRelease: "Firmware version:",
    labelUsbLocalFile: "Local factory binary (.bin):",
    btnStartUsbFlash: "Flash USB Dongle",
    flashingInProgress: "Flashing in progress...",
    usbNativeHintTitle: "Native USB boards (M5Stamp S3, XIAO ESP32-S3):",
    usbNativeHintDesc: "If connection fails, hold down the BOOT button while plugging in the USB cable. After flashing, press the RESET button to start.",

    // Wi-Fi Config Tab
    wifiTitle: "Dongle Wi-Fi Configuration",
    wifiDesc: "Send your home Wi-Fi network name (SSID) and security password through the USB serial link.",
    labelWifiPort: "Dongle USB Port:",
    selectPort: "Select a port...",
    labelWifiSsid: "Wi-Fi Network Name (SSID):",
    labelWifiPass: "Wi-Fi Password:",
    btnSendWifi: "Save Wi-Fi to Dongle",
    wifiConfigSuccess: "Wi-Fi credentials sent! The dongle is attempting to connect...",
    wifiNativeHintTitle: "Wi-Fi Tip:",
    wifiNativeHintDesc: "On boards without a dedicated UART chip, you can also configure Wi-Fi by connecting to the \"Open-Firenet-Setup\" access point (192.168.4.1).",

    // Releases Tab
    releasesTitle: "Official Open Firenet Releases",
    releasesDesc: "History of official releases on GitHub verified cryptographically with Minisign.",
    btnRefreshReleases: "Reload",
    checkingReleases: "Querying GitHub...",
    checkingReleasesDesc: "Checking official releases on openfirenet/open-firenet...",
    badgeStable: "Stable",
    badgePrerelease: "Pre-release",
    availableFiles: "Files & signatures:",
    viewOnGithub: "View on GitHub",
    showNotes: "Show notes",
    hideNotes: "Hide notes",
    useForOta: "Install via Wi-Fi (OTA)",
    useForUsb: "Install via USB Flash",
    noReleaseTitle: "No official releases found",
    noReleaseDesc: "You can flash or update your dongle directly using a local .bin file.",

    // Modal confirmation flash USB & OTA
    modalConfirmTitle: "USB Flashing Confirmation",
    modalConfirmDesc: "You are about to flash your Open Firenet dongle. Please verify the settings below:",
    modalTargetPort: "Target USB Port:",
    modalTargetVersion: "Firmware:",
    modalConfirmWarning: "Warning: This operation will write to the ESP32 flash memory. Do not unplug the dongle during the process!",
    modalConfirmWarningFactory: "Warning: This will overwrite the entire flash memory. Wi-Fi configuration will need to be reconfigured!",
    modalBtnCancel: "Cancel",
    modalBtnConfirm: "Confirm & Flash",

    modalOtaConfirmTitle: "Wireless Update Confirmation (OTA)",
    modalOtaConfirmDesc: "You are about to update your Open Firenet dongle over the Wi-Fi network:",
    modalTargetIp: "Target IP Address:",
    modalOtaConfirmWarning: "Warning: Ensure the stove and dongle remain powered on during the transfer. Do not disconnect power!",
    modalOtaBtnConfirm: "Confirm & Update",

    // Footer & Alerts
    footerTagline: "Open Firenet Installer • Open-Source & Privacy First",
    footerNoStove: "No stove connected",
    footerStoveActive: "Active stove:",
    alertFillIp: "Please enter the stove IP address.",
    alertSelectVersionOrFile: "Please select a version or a local binary file.",
    alertSelectPort: "Please select a USB port.",
    alertSelectWifiPort: "Please select the dongle USB port.",
    alertFillSsid: "Please enter your Wi-Fi network name (SSID).",
    alertNoStoveDetected: "No stove detected on the network yet. Run a search first.",
    alertErrorPrefix: "Error:"
  },

  de: {
    // Header
    appTitle: "Open Firenet",
    appTitleSuffix: "Installer",
    appSubtitle: "Universeller Installations- & Update-Assistent",
    statusReady: "Bereit",
    statusSearching: "Netzwerk wird durchsucht...",
    statusNotFound: "Kein Pelletofen gefunden",
    statusFound: "Pelletofen erkannt",
    statusError: "Scan-Fehler",
    statusFlashingUsb: "USB-Flash läuft...",
    statusFlashingSuccess: "USB-Flash erfolgreich abgeschlossen!",
    statusOtaWaiting: "Warten...",
    statusOtaSending: "Firmware wird per WLAN übertragen...",
    statusOtaSuccess: "Update erfolgreich! Der Dongle startet neu.",
    statusOtaReconnecting: "Warten auf Neustart und Wiederverbindung...",
    statusOtaOnline: "Der Dongle wurde erfolgreich neu gestartet und ist wieder online!",
    otaSuccessOnline: "OTA-Update erfolgreich! Der Dongle wurde neu gestartet und ist wieder online.",

    // Tabs
    tabDiscovery: "Netzwerk-Scan",
    tabOta: "WLAN-Update",
    tabUsb: "USB-Flash",
    tabWifi: "WLAN-Setup",
    tabReleases: "Releases",

    // Discovery Tab
    discoveryTitle: "Automatische Pelletofen-Erkennung",
    discoveryDesc: "Findet Ihren Open Firenet-Ofen via mDNS (openfirenet.local) und im lokalen Netzwerk.",
    btnScanInProgress: "Suche läuft...",
    btnScan: "Suchen",
    scanLoadingTitle: "Pelletofen wird im lokalen Netzwerk gesucht...",
    scanLoadingDesc: "mDNS- und Subnetz-Scan läuft...",
    emptyDevicesTitle: "Kein Open Firenet-Ofen erkannt",
    emptyDevicesDesc: "Stellen Sie sicher, dass der Dongle eingeschaltet und im selben WLAN wie dieser Computer ist.",
    emptyBtnWifiSetup: "WLAN via USB konfigurieren",
    emptyBtnRetryScan: "Suche wiederholen",

    // Single Device Card
    stoveOnline: "Online / Verbunden",
    stoveStandby: "Standby / Verbunden",
    stoveModelDefault: "RIKA Pelletofen",
    labelIp: "IP-Adresse",
    labelHostname: "Hostname",
    labelFirmware: "Firmware-Version",
    versionUnknown: "Unbekannt",
    labelWifiSignal: "WLAN-Signal",
    btnOpenWeb: "Web-Dashboard öffnen",
    btnUpdateOta: "Per WLAN aktualisieren",

    // OTA Tab
    otaTitle: "Drahtlose Aktualisierung (OTA)",
    otaDesc: "Aktualisieren Sie die Firmware Ihres Ofens drahtlos über Ihr lokales WLAN.",
    labelOtaIp: "IP-Adresse des Ofens:",
    btnUseDetectedIp: "Erkannte IP verwenden",
    placeholderOtaIp: "Z.B. 192.168.1.93 oder openfirenet.local",
    labelOtaRelease: "Zu installierende Firmware-Version:",
    loadingReleases: "Offizielle Versionen werden geladen...",
    labelLocalFile: "Lokale Binärdatei (.bin):",
    labelFirmwareSource: "Firmware-Quelle:",
    sourceRelease: "Offizielle Version",
    sourceLocalFile: "Lokale Datei",
    btnBrowseFile: "Durchsuchen…",
    btnStartOta: "WLAN-Update starten",
    otaSuccessMsg: "Update erfolgreich! Der Dongle startet neu.",

    // USB Tab
    usbTitle: "Serieller USB-Flash",
    usbDesc: "Ideal für das Erstflashen eines neuen ESP32-S3 oder eine Neuinstallation.",
    btnRefreshPorts: "Ports aktualisieren",
    labelUsbPort: "Verbundener USB-Seriell-Port:",
    detectingPorts: "Ports werden gesucht...",
    noPortDetected: "Kein serieller Port erkannt (Dongle per USB anschließen)",
    labelUsbMode: "USB-Vorgang:",
    usbModeUpdateTitle: "Update (Einstellungen behalten)",
    usbModeUpdateDesc: "Behält WLAN-Zugangsdaten und NVS-Einstellungen bei",
    usbModeFactoryTitle: "Kompletter Reset (Werkseinstellung)",
    usbModeFactoryDesc: "Überschreibt gesamten Flash-Speicher (WLAN-Setup erforderlich)",
    labelUsbRelease: "Firmware-Version:",
    labelUsbLocalFile: "Lokale Factory-Binärdatei (.bin):",
    btnStartUsbFlash: "USB-Dongle flashen",
    flashingInProgress: "Flashvorgang läuft...",
    usbNativeHintTitle: "Boards mit nativem USB (M5Stamp S3, XIAO ESP32-S3):",
    usbNativeHintDesc: "Falls die Verbindung fehlschlägt, halten Sie beim Einstecken des USB-Kabels die BOOT-Taste gedrückt. Drücken Sie nach dem Flashen die RESET-Taste zum Starten.",

    // Wi-Fi Config Tab
    wifiTitle: "WLAN-Konfiguration des Dongles",
    wifiDesc: "Übertragen Sie WLAN-Name (SSID) und Passwort über die USB-Verbindung an den Dongle.",
    labelWifiPort: "USB-Port des Dongles:",
    selectPort: "Port auswählen...",
    labelWifiSsid: "WLAN-Netzwerkname (SSID):",
    labelWifiPass: "WLAN-Passwort:",
    btnSendWifi: "WLAN auf Dongle speichern",
    wifiConfigSuccess: "WLAN-Daten gesendet! Der Dongle verbindet sich...",
    wifiNativeHintTitle: "WLAN-Tipp:",
    wifiNativeHintDesc: "Auf Boards ohne dedizierten UART-Chip können Sie das WLAN auch über den Access Point „Open-Firenet-Setup“ (192.168.4.1) konfigurieren.",

    // Releases Tab
    releasesTitle: "Offizielle Open Firenet Releases",
    releasesDesc: "Übersicht der offiziellen GitHub-Releases mit Minisign-Kryptosignatur.",
    btnRefreshReleases: "Neu laden",
    checkingReleases: "GitHub wird abgefragt...",
    checkingReleasesDesc: "Prüfung offizieller Releases auf openfirenet/open-firenet...",
    badgeStable: "Stabil",
    badgePrerelease: "Pre-Release",
    availableFiles: "Dateien & Signaturen:",
    viewOnGithub: "Auf GitHub ansehen",
    showNotes: "Notizen anzeigen",
    hideNotes: "Notizen ausblenden",
    useForOta: "Per WLAN installieren (OTA)",
    useForUsb: "Per USB-Flash installieren",
    noReleaseTitle: "Keine offiziellen Versionen gefunden",
    noReleaseDesc: "Sie können Ihren Dongle direkt mit einer lokalen .bin-Datei flashen.",

    // Modal confirmation flash USB & OTA
    modalConfirmTitle: "Bestätigung des USB-Flashvorgangs",
    modalConfirmDesc: "Sie sind dabei, die Firmware auf den Open Firenet-Dongle zu schreiben. Bitte Einstellungen prüfen:",
    modalTargetPort: "Ziel-USB-Port:",
    modalTargetVersion: "Firmware:",
    modalConfirmWarning: "Achtung: Dieser Vorgang beschreibt den Flash-Speicher des ESP32. Dongle nicht trennen!",
    modalConfirmWarningFactory: "Achtung: Dieser Vorgang überschreibt den gesamten Flash-Speicher. WLAN muss danach neu eingerichtet werden!",
    modalBtnCancel: "Abbrechen",
    modalBtnConfirm: "Bestätigen & Flashen",

    modalOtaConfirmTitle: "Bestätigung des WLAN-Updates (OTA)",
    modalOtaConfirmDesc: "Sie sind dabei, Ihren Open Firenet-Dongle über das WLAN-Netzwerk zu aktualisieren:",
    modalTargetIp: "Ziel-IP-Adresse:",
    modalOtaConfirmWarning: "Achtung: Stellen Sie sicher, dass Ofen und Dongle während der Übertragung eingeschaltet bleiben!",
    modalOtaBtnConfirm: "Bestätigen & Aktualisieren",

    // Footer & Alerts
    footerTagline: "Open Firenet Installer • Open-Source & Datenschutz",
    footerNoStove: "Kein Pelletofen verbunden",
    footerStoveActive: "Aktiver Ofen:",
    alertFillIp: "Bitte geben Sie die IP-Adresse des Ofens ein.",
    alertSelectVersionOrFile: "Bitte wählen Sie eine Version oder eine lokale Binärdatei aus.",
    alertSelectPort: "Bitte wählen Sie einen USB-Port aus.",
    alertSelectWifiPort: "Bitte wählen Sie den USB-Port des Dongles aus.",
    alertFillSsid: "Bitte geben Sie den Namen Ihres WLAN-Netzwerks (SSID) ein.",
    alertNoStoveDetected: "Bisher kein Ofen im Netzwerk erkannt. Bitte zuerst einen Scan starten.",
    alertErrorPrefix: "Fehler:"
  }
};

let currentLang = localStorage.getItem("of_lang") || (navigator.language.startsWith("de") ? "de" : navigator.language.startsWith("en") ? "en" : "fr");

export function getLang() {
  return currentLang;
}

export function t(key) {
  const dict = translations[currentLang] || translations.fr;
  return dict[key] || translations.fr[key] || key;
}

export function setLanguage(lang, onLangChangeCallback) {
  if (lang !== "fr" && lang !== "en" && lang !== "de") lang = "fr";
  currentLang = lang;
  localStorage.setItem("of_lang", lang);
  document.documentElement.lang = lang;

  // Update static DOM elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.placeholder = t(key);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) el.title = t(key);
  });

  // Sync dropdown value
  const selectEl = document.getElementById("lang-select");
  if (selectEl && selectEl.value !== lang) {
    selectEl.value = lang;
  }

  if (typeof onLangChangeCallback === "function") {
    onLangChangeCallback(lang);
  }
}
