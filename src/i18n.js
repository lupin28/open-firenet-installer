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
    otaErrSlotTooSmall: "L'emplacement de mise à jour de cette clé fait {slot} octets et ce firmware en fait {firmware}. Une mise à jour sans fil ne peut pas agrandir cet emplacement : flashez la clé une fois par USB, ce qui réécrit la table de partitions. Le Wi-Fi sera à ressaisir, puis les mises à jour sans fil fonctionneront de nouveau.",
    otaErrNoConnection: "Délai d'attente dépassé : la clé n'a pas pu se connecter au port TCP {port} de cet ordinateur. Vérifiez que votre pare-feu autorise les connexions entrantes sur le réseau local.",
    otaErrSlotMaybeTooSmall: "Autre cause possible : l'emplacement de mise à jour de la clé est trop petit pour ce firmware ({firmware} octets). Il fait {slot} octets quand la clé a été flashée depuis l'IDE Arduino avec le schéma de partition par défaut. Dans ce cas, flashez la clé une fois par USB, ce qui réécrit la table de partitions. Le Wi-Fi sera à ressaisir, puis les mises à jour sans fil fonctionneront de nouveau.",
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
    otaErrSlotTooSmall: "This stick's update slot is {slot} bytes and this firmware is {firmware} bytes. A wireless update cannot enlarge the slot: flash the stick once over USB, which rewrites the partition table. You will have to enter the Wi-Fi again; wireless updates will work afterwards.",
    otaErrNoConnection: "Timed out: the stick could not connect to TCP port {port} of this computer. Check that your firewall allows incoming connections on the local network.",
    otaErrSlotMaybeTooSmall: "Other possible cause: the stick's update slot is too small for this firmware ({firmware} bytes). It is {slot} bytes when the stick was flashed from the Arduino IDE with the default partition scheme. In that case, flash the stick once over USB, which rewrites the partition table. You will have to enter the Wi-Fi again; wireless updates will work afterwards.",
    alertErrorPrefix: "Error:"
  },

  it: {
    "appTitle": "Open Firenet",
    "appTitleSuffix": "Installer",
    "appSubtitle": "Assistente per l'installazione e l'aggiornamento",
    "statusReady": "Pronto",
    "statusSearching": "Ricerca nella rete...",
    "statusNotFound": "Nessuna stufa trovata",
    "statusFound": "Stufa rilevata",
    "statusError": "Errore nella ricerca",
    "statusFlashingUsb": "Scrittura del firmware tramite USB...",
    "statusFlashingSuccess": "Firmware scritto correttamente!",
    "statusOtaWaiting": "In attesa...",
    "statusOtaSending": "Invio del firmware tramite Wi-Fi...",
    "statusOtaSuccess": "Aggiornamento riuscito! Il dongle si sta riavviando.",
    "statusOtaReconnecting": "In attesa del riavvio e della riconnessione alla rete...",
    "statusOtaOnline": "Il dongle si è riavviato correttamente ed è di nuovo online!",
    "otaSuccessOnline": "Aggiornamento OTA riuscito! Il dongle si è riavviato ed è di nuovo online.",
    "tabDiscovery": "Ricerca in rete",
    "tabOta": "Aggiornamento Wi-Fi",
    "tabUsb": "Installazione USB",
    "tabWifi": "Configurazione Wi-Fi",
    "tabReleases": "Versioni",
    "discoveryTitle": "Rilevamento automatico della stufa",
    "discoveryDesc": "Rileva la tua stufa Open Firenet tramite mDNS (openfirenet.local) e la sottorete locale.",
    "btnScanInProgress": "Ricerca...",
    "btnScan": "Cerca",
    "scanLoadingTitle": "Ricerca della stufa nella rete locale...",
    "scanLoadingDesc": "Verifica tramite mDNS e della sottorete locale in corso...",
    "emptyDevicesTitle": "Nessuna stufa Open Firenet rilevata",
    "emptyDevicesDesc": "Verifica che il dongle sia acceso e connesso alla stessa rete Wi-Fi del computer.",
    "emptyBtnWifiSetup": "Configura Wi-Fi tramite USB",
    "emptyBtnRetryScan": "Cerca di nuovo",
    "stoveOnline": "Online / Connessa",
    "stoveStandby": "Standby / Connessa",
    "stoveModelDefault": "Stufa RIKA",
    "labelIp": "Indirizzo IP",
    "labelHostname": "Nome host",
    "labelFirmware": "Versione firmware",
    "versionUnknown": "Sconosciuta",
    "labelWifiSignal": "Segnale Wi-Fi",
    "btnOpenWeb": "Apri pannello web",
    "btnUpdateOta": "Aggiorna tramite Wi-Fi",
    "otaTitle": "Aggiornamento tramite Wi-Fi (OTA)",
    "otaDesc": "Aggiorna da remoto il firmware della tua stufa tramite la rete Wi-Fi locale.",
    "labelOtaIp": "Indirizzo IP della stufa:",
    "btnUseDetectedIp": "Usa IP rilevato",
    "placeholderOtaIp": "Es. 192.168.1.93 o openfirenet.local",
    "labelOtaRelease": "Versione firmware da installare:",
    "loadingReleases": "Caricamento delle versioni ufficiali...",
    "labelLocalFile": "File binario locale (.bin):",
    "labelFirmwareSource": "Origine del firmware:",
    "sourceRelease": "Versione ufficiale",
    "sourceLocalFile": "File locale",
    "btnBrowseFile": "Sfoglia…",
    "btnStartOta": "Avvia aggiornamento OTA",
    "otaSuccessMsg": "Aggiornamento riuscito! Il dongle si sta riavviando.",
    "usbTitle": "Installazione tramite USB seriale",
    "usbDesc": "Ideale per la prima installazione su un ESP32-S3 nuovo o per una reinstallazione completa.",
    "btnRefreshPorts": "Aggiorna porte",
    "labelUsbPort": "Porta seriale USB connessa:",
    "detectingPorts": "Rilevamento delle porte seriali...",
    "noPortDetected": "Nessuna porta seriale rilevata (collega il dongle tramite USB)",
    "labelUsbMode": "Tipo di operazione USB:",
    "usbModeUpdateTitle": "Aggiornamento (mantieni configurazione)",
    "usbModeUpdateDesc": "Mantiene le credenziali Wi-Fi e le impostazioni NVS",
    "usbModeFactoryTitle": "Ripristino completo (immagine di fabbrica)",
    "usbModeFactoryDesc": "Sovrascrive tutta la memoria flash (richiede la configurazione Wi-Fi)",
    "labelUsbRelease": "Versione firmware:",
    "labelUsbLocalFile": "File binario locale di fabbrica (.bin):",
    "btnStartUsbFlash": "Installa firmware sul dongle USB",
    "flashingInProgress": "Scrittura del firmware...",
    "usbNativeHintTitle": "Schede con USB nativa (M5Stamp S3, XIAO ESP32-S3):",
    "usbNativeHintDesc": "Se la connessione non riesce, tieni premuto BOOT mentre colleghi il cavo USB. Dopo l'installazione, premi RESET per avviare.",
    "wifiTitle": "Configurazione Wi-Fi del dongle",
    "wifiDesc": "Invia il nome della rete Wi-Fi di casa (SSID) e la password tramite il collegamento seriale USB.",
    "labelWifiPort": "Porta USB del dongle:",
    "selectPort": "Seleziona una porta...",
    "labelWifiSsid": "Nome della rete Wi-Fi (SSID):",
    "labelWifiPass": "Password Wi-Fi:",
    "btnSendWifi": "Salva Wi-Fi sul dongle",
    "wifiConfigSuccess": "Credenziali Wi-Fi inviate! Il dongle sta tentando di connettersi...",
    "wifiNativeHintTitle": "Suggerimento Wi-Fi:",
    "wifiNativeHintDesc": "Sulle schede senza un chip UART dedicato, puoi configurare il Wi-Fi anche collegandoti all'Access Point \"Open-Firenet-Setup\" (192.168.4.1).",
    "releasesTitle": "Versioni ufficiali di Open Firenet",
    "releasesDesc": "Cronologia delle versioni ufficiali su GitHub, verificate crittograficamente con Minisign.",
    "btnRefreshReleases": "Ricarica",
    "checkingReleases": "Consultazione di GitHub...",
    "checkingReleasesDesc": "Verifica delle versioni ufficiali su openfirenet/open-firenet...",
    "badgeStable": "Stabile",
    "badgePrerelease": "Pre-release",
    "availableFiles": "File e firme:",
    "viewOnGithub": "Apri su GitHub",
    "showNotes": "Mostra note",
    "hideNotes": "Nascondi note",
    "useForOta": "Installa tramite Wi-Fi (OTA)",
    "useForUsb": "Installa tramite USB",
    "noReleaseTitle": "Nessuna versione ufficiale trovata",
    "noReleaseDesc": "Puoi installare o aggiornare il dongle direttamente usando un file .bin locale.",
    "modalConfirmTitle": "Conferma installazione USB",
    "modalConfirmDesc": "Stai per scrivere il firmware sul dongle Open Firenet. Verifica le impostazioni qui sotto:",
    "modalTargetPort": "Porta USB di destinazione:",
    "modalTargetVersion": "Firmware:",
    "modalConfirmWarning": "Attenzione: questa operazione scriverà nella memoria flash dell'ESP32. Non scollegare il dongle durante la procedura!",
    "modalConfirmWarningFactory": "Attenzione: tutta la memoria flash verrà sovrascritta. Dovrai riconfigurare il Wi-Fi!",
    "modalBtnCancel": "Annulla",
    "modalBtnConfirm": "Conferma e installa",
    "modalOtaConfirmTitle": "Conferma aggiornamento Wi-Fi (OTA)",
    "modalOtaConfirmDesc": "Stai per aggiornare il dongle Open Firenet tramite la rete Wi-Fi:",
    "modalTargetIp": "Indirizzo IP di destinazione:",
    "modalOtaConfirmWarning": "Attenzione: la stufa e il dongle devono rimanere alimentati durante il trasferimento. Non togliere alimentazione!",
    "modalOtaBtnConfirm": "Conferma e aggiorna",
    "footerTagline": "Open Firenet Installer • Open source e privacy al primo posto",
    "footerNoStove": "Nessuna stufa connessa",
    "footerStoveActive": "Stufa attiva:",
    "alertFillIp": "Inserisci l'indirizzo IP della stufa.",
    "alertSelectVersionOrFile": "Seleziona una versione o un file binario locale.",
    "alertSelectPort": "Seleziona una porta USB.",
    "alertSelectWifiPort": "Seleziona la porta USB del dongle.",
    "alertFillSsid": "Inserisci il nome della rete Wi-Fi (SSID).",
    "alertNoStoveDetected": "Nessuna stufa ancora rilevata nella rete. Avvia prima una ricerca.",
    "otaErrSlotTooSmall": "Lo spazio di aggiornamento di questo dongle è di {slot} byte e questo firmware ne occupa {firmware}. Un aggiornamento tramite Wi-Fi non può ampliare questo spazio: esegui una volta il flash del dongle tramite USB, che riscrive la tabella delle partizioni. Dovrai reinserire il Wi-Fi; dopo, gli aggiornamenti tramite Wi-Fi funzioneranno di nuovo.",
    "otaErrNoConnection": "Tempo scaduto: il dongle non è riuscito a connettersi alla porta TCP {port} di questo computer. Verifica che il firewall consenta le connessioni in entrata sulla rete locale.",
    "otaErrSlotMaybeTooSmall": "Altra causa possibile: lo spazio di aggiornamento del dongle è troppo piccolo per questo firmware ({firmware} byte). È di {slot} byte quando il dongle è stato programmato dall'IDE Arduino con lo schema di partizioni predefinito. In tal caso, esegui una volta il flash del dongle tramite USB, che riscrive la tabella delle partizioni. Dovrai reinserire il Wi-Fi; dopo, gli aggiornamenti tramite Wi-Fi funzioneranno di nuovo.",
    "alertErrorPrefix": "Errore:"
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
    otaErrSlotTooSmall: "Der Update-Speicherplatz dieses Sticks hat {slot} Bytes, diese Firmware {firmware} Bytes. Ein drahtloses Update kann den Speicherplatz nicht vergrößern: Flashen Sie den Stick einmal per USB, dabei wird die Partitionstabelle neu geschrieben. Das WLAN muss danach neu eingegeben werden; drahtlose Updates funktionieren dann wieder.",
    otaErrNoConnection: "Zeitüberschreitung: Der Stick konnte sich nicht mit TCP-Port {port} dieses Computers verbinden. Prüfen Sie, ob Ihre Firewall eingehende Verbindungen im lokalen Netzwerk zulässt.",
    otaErrSlotMaybeTooSmall: "Andere mögliche Ursache: Der Update-Speicherplatz des Sticks ist für diese Firmware ({firmware} Bytes) zu klein. Er hat {slot} Bytes, wenn der Stick aus der Arduino IDE mit dem Standard-Partitionsschema geflasht wurde. Flashen Sie den Stick in diesem Fall einmal per USB, dabei wird die Partitionstabelle neu geschrieben. Das WLAN muss danach neu eingegeben werden; drahtlose Updates funktionieren dann wieder.",
    alertErrorPrefix: "Fehler:"
  }
};

let currentLang = localStorage.getItem("of_lang") || (navigator.language.startsWith("it") ? "it" : navigator.language.startsWith("de") ? "de" : navigator.language.startsWith("en") ? "en" : "fr");

export function getLang() {
  return currentLang;
}

export function t(key) {
  const dict = translations[currentLang] || translations.fr;
  return dict[key] || translations.fr[key] || key;
}

// Text of an error sent by the backend: either a plain message, or "i18n:" + JSON naming a translated text
// (`key`, optionally a second one in `also`) and the values that fill its {placeholders}.
export function errorText(err) {
  const raw = String(err);
  if (!raw.startsWith("i18n:")) return raw;
  try {
    const data = JSON.parse(raw.slice(5));
    const fill = (key) => t(key).replace(/\{(\w+)\}/g, (m, name) => (name in data ? data[name] : m));
    return [data.key, data.also].filter(Boolean).map(fill).join("\n\n");
  } catch (e) {
    return raw;
  }
}

export function setLanguage(lang, onLangChangeCallback) {
  if (lang !== "fr" && lang !== "en" && lang !== "de" && lang !== "it") lang = "fr";
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
