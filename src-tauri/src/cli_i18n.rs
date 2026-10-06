#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum CliLang {
    #[default]
    Fr,
    En,
    De,
}

impl CliLang {
    pub fn from_str(s: &str) -> Self {
        match s.trim().to_lowercase().as_str() {
            "en" | "english" => CliLang::En,
            "de" | "deutsch" | "german" => CliLang::De,
            _ => CliLang::Fr,
        }
    }

    pub fn detect() -> Self {
        if let Ok(lang_var) = std::env::var("LANG").or_else(|_| std::env::var("LC_ALL")) {
            let l = lang_var.to_lowercase();
            if l.starts_with("de") {
                return CliLang::De;
            } else if l.starts_with("en") {
                return CliLang::En;
            }
        }
        CliLang::Fr
    }

    /// Text of a wireless update failure the user can act on.
    pub fn ota_failure(&self, failure: &crate::flasher_ota::OtaFailure) -> String {
        use crate::flasher_ota::{OtaFailure, OtaFlasher};
        match *failure {
            OtaFailure::SlotTooSmall { firmware_bytes, slot_bytes } => match self {
                CliLang::Fr => format!("L'emplacement de mise à jour de cette clé fait {} octets et ce firmware en fait {}. Une mise à jour sans fil ne peut pas agrandir cet emplacement : flashez la clé une fois par USB, ce qui réécrit la table de partitions. Le Wi-Fi sera à ressaisir, puis les mises à jour sans fil fonctionneront de nouveau.", slot_bytes, firmware_bytes),
                CliLang::En => format!("This stick's update slot is {} bytes and this firmware is {} bytes. A wireless update cannot enlarge the slot: flash the stick once over USB, which rewrites the partition table. You will have to enter the Wi-Fi again; wireless updates will work afterwards.", slot_bytes, firmware_bytes),
                CliLang::De => format!("Der Update-Speicherplatz dieses Sticks hat {} Bytes, diese Firmware {} Bytes. Ein drahtloses Update kann den Speicherplatz nicht vergrößern: Flashen Sie den Stick einmal per USB, dabei wird die Partitionstabelle neu geschrieben. Das WLAN muss danach neu eingegeben werden; drahtlose Updates funktionieren dann wieder.", slot_bytes, firmware_bytes),
            },
            OtaFailure::NoTcpConnection { port, firmware_bytes, slot_may_be_too_small } => {
                let mut text = match self {
                    CliLang::Fr => format!("Délai d'attente dépassé : la clé n'a pas pu se connecter au port TCP {} de cet ordinateur. Vérifiez que votre pare-feu autorise les connexions entrantes sur le réseau local.", port),
                    CliLang::En => format!("Timed out: the stick could not connect to TCP port {} of this computer. Check that your firewall allows incoming connections on the local network.", port),
                    CliLang::De => format!("Zeitüberschreitung: Der Stick konnte sich nicht mit TCP-Port {} dieses Computers verbinden. Prüfen Sie, ob Ihre Firewall eingehende Verbindungen im lokalen Netzwerk zulässt.", port),
                };
                if slot_may_be_too_small {
                    let slot = OtaFlasher::DEFAULT_SCHEME_SLOT_BYTES;
                    text.push_str("\n\n");
                    text.push_str(&match self {
                        CliLang::Fr => format!("Autre cause possible : l'emplacement de mise à jour de la clé est trop petit pour ce firmware ({} octets). Il fait {} octets quand la clé a été flashée depuis l'IDE Arduino avec le schéma de partition par défaut. Dans ce cas, flashez la clé une fois par USB, ce qui réécrit la table de partitions. Le Wi-Fi sera à ressaisir, puis les mises à jour sans fil fonctionneront de nouveau.", firmware_bytes, slot),
                        CliLang::En => format!("Other possible cause: the stick's update slot is too small for this firmware ({} bytes). It is {} bytes when the stick was flashed from the Arduino IDE with the default partition scheme. In that case, flash the stick once over USB, which rewrites the partition table. You will have to enter the Wi-Fi again; wireless updates will work afterwards.", firmware_bytes, slot),
                        CliLang::De => format!("Andere mögliche Ursache: Der Update-Speicherplatz des Sticks ist für diese Firmware ({} Bytes) zu klein. Er hat {} Bytes, wenn der Stick aus der Arduino IDE mit dem Standard-Partitionsschema geflasht wurde. Flashen Sie den Stick in diesem Fall einmal per USB, dabei wird die Partitionstabelle neu geschrieben. Das WLAN muss danach neu eingegeben werden; drahtlose Updates funktionieren dann wieder.", firmware_bytes, slot),
                    });
                }
                text
            }
        }
    }

    pub fn banner_subtitle(&self) -> &'static str {
        match self {
            CliLang::Fr => "Assistant multiplateforme de flash USB et mise à jour",
            CliLang::En => "Cross-platform USB flashing and update assistant",
            CliLang::De => "Plattformübergreifender USB-Flash- und Update-Assistent",
        }
    }

    pub fn menu_title(&self) -> &'static str {
        match self {
            CliLang::Fr => "Que souhaitez-vous faire ?",
            CliLang::En => "What would you like to do?",
            CliLang::De => "Was möchten Sie tun?",
        }
    }

    pub fn menu_choices(&self) -> [&'static str; 7] {
        match self {
            CliLang::Fr => [
                "🔍 1. Scanner le réseau local (détecter la clé & état du poêle)",
                "⚡ 2. Flasher la clé en USB (premier flash / réinstallation)",
                "📡 3. Mettre à jour la clé à distance via Wi-Fi (OTA)",
                "📶 4. Configurer le Wi-Fi de la clé (via USB Série)",
                "📦 5. Consulter les versions GitHub (releases & pré-releases)",
                "📟 6. Moniteur Série (voir les logs du poêle en direct)",
                "🚪 7. Quitter",
            ],
            CliLang::En => [
                "🔍 1. Scan local network (discover dongle & stove status)",
                "⚡ 2. Flash dongle via USB (first flash / reinstall)",
                "📡 3. Update dongle remotely via Wi-Fi (OTA)",
                "📶 4. Configure dongle Wi-Fi (via USB Serial)",
                "📦 5. Browse GitHub versions (releases & pre-releases)",
                "📟 6. Serial Monitor (view stove logs live)",
                "🚪 7. Quit",
            ],
            CliLang::De => [
                "🔍 1. Lokales Netzwerk scannen (Dongle & Ofenstatus finden)",
                "⚡ 2. Dongle per USB flashen (Erstflash / Neuinstallation)",
                "📡 3. Dongle drahtlos per WLAN aktualisieren (OTA)",
                "📶 4. WLAN des Dongles einrichten (über USB-Seriell)",
                "📦 5. GitHub-Versionen ansehen (Releases & Pre-Releases)",
                "📟 6. Serieller Monitor (Live-Logs des Ofens ansehen)",
                "🚪 7. Beenden",
            ],
        }
    }

    pub fn menu_return_prompt(&self) -> &'static str {
        match self {
            CliLang::Fr => "Revenir au menu principal ?",
            CliLang::En => "Return to main menu?",
            CliLang::De => "Zurück zum Hauptmenü?",
        }
    }

    pub fn goodbye(&self) -> &'static str {
        match self {
            CliLang::Fr => "Au revoir !",
            CliLang::En => "Goodbye!",
            CliLang::De => "Auf Wiedersehen!",
        }
    }

    pub fn scan_searching(&self) -> &'static str {
        match self {
            CliLang::Fr => "🔍 Recherche de la clé Open Firenet sur votre réseau...",
            CliLang::En => "🔍 Searching for Open Firenet dongle on your network...",
            CliLang::De => "🔍 Open Firenet-Dongle wird im Netzwerk gesucht...",
        }
    }

    pub fn scan_not_found(&self) -> &'static str {
        match self {
            CliLang::Fr => "❌ Aucune clé Open Firenet détectée sur le réseau.",
            CliLang::En => "❌ No Open Firenet dongle detected on the network.",
            CliLang::De => "❌ Kein Open Firenet-Dongle im Netzwerk gefunden.",
        }
    }

    pub fn scan_tips(&self) -> [&'static str; 4] {
        match self {
            CliLang::Fr => [
                "Conseils :",
                "  - Vérifiez que la clé est bien allumée et connectée au Wi-Fi.",
                "  - Si c'est un premier démarrage, connectez-vous au point d'accès Wi-Fi 'Open-Firenet-Setup'.",
                "  - Ou branchez-la en USB pour effectuer le premier flashage.",
            ],
            CliLang::En => [
                "Tips:",
                "  - Verify that the dongle is powered on and connected to Wi-Fi.",
                "  - If first boot, connect to Wi-Fi access point 'Open-Firenet-Setup'.",
                "  - Or plug it in via USB to perform the first flash.",
            ],
            CliLang::De => [
                "Tipps:",
                "  - Stellen Sie sicher, dass der Dongle eingeschaltet und im WLAN ist.",
                "  - Beim Erststart mit dem WLAN-Zugangspunkt 'Open-Firenet-Setup' verbinden.",
                "  - Oder per USB anschließen, um den ersten Flash durchzuführen.",
            ],
        }
    }

    pub fn scan_found(&self, count: usize) -> String {
        match self {
            CliLang::Fr => format!("✔ {} clé(s) Open Firenet trouvée(s) :", count),
            CliLang::En => format!("✔ {} Open Firenet dongle(s) found:", count),
            CliLang::De => format!("✔ {} Open Firenet-Dongle(s) gefunden:", count),
        }
    }

    pub fn label_ip(&self) -> &'static str {
        match self {
            CliLang::Fr => "Adresse IP",
            CliLang::En => "IP Address",
            CliLang::De => "IP-Adresse",
        }
    }

    pub fn label_hostname(&self) -> &'static str {
        match self {
            CliLang::Fr => "Nom d'hôte",
            CliLang::En => "Hostname",
            CliLang::De => "Hostname",
        }
    }

    pub fn label_stove_model(&self) -> &'static str {
        match self {
            CliLang::Fr => "Modèle poêle",
            CliLang::En => "Stove model",
            CliLang::De => "Ofenmodell",
        }
    }

    pub fn label_stove_state(&self) -> &'static str {
        match self {
            CliLang::Fr => "État actuel",
            CliLang::En => "Current state",
            CliLang::De => "Aktueller Status",
        }
    }

    pub fn label_wifi_signal(&self) -> &'static str {
        match self {
            CliLang::Fr => "Signal Wi-Fi",
            CliLang::En => "Wi-Fi Signal",
            CliLang::De => "WLAN-Signal",
        }
    }

    pub fn label_firmware_version(&self) -> &'static str {
        match self {
            CliLang::Fr => "Version firmw.",
            CliLang::En => "Firmware ver.",
            CliLang::De => "Firmware-Vers.",
        }
    }

    pub fn label_web_access(&self) -> &'static str {
        match self {
            CliLang::Fr => "Accès Web",
            CliLang::En => "Web Access",
            CliLang::De => "Web-Zugriff",
        }
    }

    pub fn flash_usb_title(&self) -> &'static str {
        match self {
            CliLang::Fr => "⚡ Flashage USB série de la clé Open Firenet",
            CliLang::En => "⚡ USB Serial Flashing of Open Firenet dongle",
            CliLang::De => "⚡ USB-Serieller Flash des Open Firenet-Dongles",
        }
    }

    pub fn select_serial_port(&self) -> &'static str {
        match self {
            CliLang::Fr => "Sélectionnez le port série USB de votre ESP32-S3 :",
            CliLang::En => "Select the USB serial port of your ESP32-S3:",
            CliLang::De => "Wählen Sie den USB-Seriell-Port Ihres ESP32-S3:",
        }
    }

    pub fn no_serial_port_found(&self) -> &'static str {
        match self {
            CliLang::Fr => "❌ Aucun port série USB détecté. Branchez votre ESP32-S3 en USB.",
            CliLang::En => "❌ No USB serial port detected. Plug in your ESP32-S3 via USB.",
            CliLang::De => "❌ Kein USB-Seriell-Port erkannt. Bitte ESP32-S3 per USB anschließen.",
        }
    }

    pub fn usb_native_hint(&self) -> &'static str {
        match self {
            CliLang::Fr => "💡 Cartes à USB natif (M5Stamp S3, XIAO ESP32-S3) : si la connexion échoue, maintenez le bouton BOOT enfoncé lors du branchement USB.",
            CliLang::En => "💡 Native USB boards (M5Stamp S3, XIAO ESP32-S3): if connection fails, hold down the BOOT button while plugging in the USB cable.",
            CliLang::De => "💡 Boards mit nativem USB (M5Stamp S3, XIAO ESP32-S3): falls Verbindung fehlschlägt, halten Sie beim Einstecken die BOOT-Taste gedrückt.",
        }
    }

    pub fn usb_post_flash_hint(&self) -> &'static str {
        match self {
            CliLang::Fr => "💡 Note : Sur les cartes à USB natif, appuyez sur le bouton RESET pour lancer le nouveau firmware.",
            CliLang::En => "💡 Note: On native USB boards, press the RESET button to start the new firmware.",
            CliLang::De => "💡 Hinweis: Drücken Sie bei Boards mit nativem USB die RESET-Taste, um die neue Firmware zu starten.",
        }
    }

    pub fn ota_updating_to(&self, ip: &str) -> String {
        match self {
            CliLang::Fr => format!("📡 Mise à jour Wi-Fi (OTA) vers {}", ip),
            CliLang::En => format!("📡 Wi-Fi Update (OTA) to {}", ip),
            CliLang::De => format!("📡 WLAN-Update (OTA) an {}", ip),
        }
    }

    pub fn select_dongle_to_update(&self) -> &'static str {
        match self {
            CliLang::Fr => "Sélectionnez la clé à mettre à jour :",
            CliLang::En => "Select the dongle to update:",
            CliLang::De => "Wählen Sie den zu aktualisierenden Dongle:",
        }
    }

    pub fn enter_ip_prompt(&self) -> &'static str {
        match self {
            CliLang::Fr => "Entrez l'adresse IP de votre clé Open Firenet",
            CliLang::En => "Enter the IP address of your Open Firenet dongle",
            CliLang::De => "Geben Sie die IP-Adresse des Open Firenet-Dongles ein",
        }
    }

    pub fn fetching_releases(&self) -> &'static str {
        match self {
            CliLang::Fr => "Récupération des versions disponibles sur GitHub...",
            CliLang::En => "Fetching available releases from GitHub...",
            CliLang::De => "Verfügbare Releases von GitHub werden abgerufen...",
        }
    }

    pub fn no_releases_found(&self) -> &'static str {
        match self {
            CliLang::Fr => "Aucune release publiée sur GitHub pour le moment.",
            CliLang::En => "No releases published on GitHub yet.",
            CliLang::De => "Bisher keine offiziellen Releases auf GitHub veröffentlicht.",
        }
    }

    pub fn enter_bin_path_prompt(&self) -> &'static str {
        match self {
            CliLang::Fr => "Chemin vers votre fichier binaire .bin local",
            CliLang::En => "Path to your local .bin binary file",
            CliLang::De => "Pfad zu Ihrer lokalen .bin-Binärdatei",
        }
    }

    pub fn choose_version_prompt(&self) -> &'static str {
        match self {
            CliLang::Fr => "Choisissez la version à installer :",
            CliLang::En => "Choose the version to install:",
            CliLang::De => "Wählen Sie die zu installierende Version:",
        }
    }

    pub fn badge_prerelease(&self) -> &'static str {
        match self {
            CliLang::Fr => " (pré-release/test)",
            CliLang::En => " (pre-release/test)",
            CliLang::De => " (Pre-Release/Test)",
        }
    }

    pub fn badge_stable(&self) -> &'static str {
        match self {
            CliLang::Fr => " (stable)",
            CliLang::En => " (stable)",
            CliLang::De => " (stabil)",
        }
    }

    pub fn no_binary_found(&self) -> &'static str {
        match self {
            CliLang::Fr => "Aucun binaire précompilé approprié trouvé dans cette release.",
            CliLang::En => "No suitable precompiled binary found in this release.",
            CliLang::De => "Keine passende vorkompilierte Binärdatei in diesem Release gefunden.",
        }
    }

    pub fn use_cached_prompt(&self, filename: &str) -> String {
        match self {
            CliLang::Fr => format!("Utiliser la version en cache ({}) ?", filename),
            CliLang::En => format!("Use cached version ({})?", filename),
            CliLang::De => format!("Version aus dem Cache verwenden ({})?", filename),
        }
    }

    pub fn downloading_asset(&self, name: &str) -> String {
        match self {
            CliLang::Fr => format!("Téléchargement et vérification cryptographique de {}...", name),
            CliLang::En => format!("Downloading and cryptographically verifying {}...", name),
            CliLang::De => format!("Herunterladen und kryptografische Überprüfung von {}...", name),
        }
    }

    pub fn verification_ok(&self) -> &'static str {
        match self {
            CliLang::Fr => "✔ Signature Minisign et intégrité SHA256 validées avec succès !",
            CliLang::En => "✔ Minisign signature and SHA256 integrity successfully verified!",
            CliLang::De => "✔ Minisign-Signatur und SHA256-Integrität erfolgreich überprüft!",
        }
    }

    pub fn releases_title(&self) -> &'static str {
        match self {
            CliLang::Fr => "📦 Versions d'Open Firenet publiées sur GitHub :",
            CliLang::En => "📦 Open Firenet releases published on GitHub:",
            CliLang::De => "📦 Auf GitHub veröffentlichte Open Firenet-Releases:",
        }
    }

    pub fn wifi_setup_title(&self) -> &'static str {
        match self {
            CliLang::Fr => "📶 Configuration Wi-Fi du dongle Open Firenet",
            CliLang::En => "📶 Open Firenet Dongle Wi-Fi Configuration",
            CliLang::De => "📶 WLAN-Konfiguration des Open Firenet-Dongles",
        }
    }

    pub fn wifi_setup_desc(&self) -> &'static str {
        match self {
            CliLang::Fr => "Ces informations permettront à la clé de se connecter à votre réseau local.",
            CliLang::En => "This information will allow the dongle to connect to your local network.",
            CliLang::De => "Diese Daten ermöglichen dem Dongle die Verbindung mit Ihrem lokalen Netzwerk.",
        }
    }

    pub fn wifi_native_hint(&self) -> &'static str {
        match self {
            CliLang::Fr => "💡 Astuce : Sur les cartes sans puce UART dédiée, vous pouvez aussi vous connecter au point d'accès Wi-Fi « Open-Firenet-Setup » (192.168.4.1) pour configurer le réseau.",
            CliLang::En => "💡 Tip: On boards without a dedicated UART chip, you can also connect to the \"Open-Firenet-Setup\" Wi-Fi access point (192.168.4.1) to configure the network.",
            CliLang::De => "💡 Tipp: Auf Boards ohne dedizierten UART-Chip können Sie das Netzwerk auch über den WLAN-Access-Point „Open-Firenet-Setup“ (192.168.4.1) einrichten.",
        }
    }

    pub fn wifi_ssid_prompt(&self) -> &'static str {
        match self {
            CliLang::Fr => "Nom de votre réseau Wi-Fi (SSID)",
            CliLang::En => "Your Wi-Fi Network Name (SSID)",
            CliLang::De => "WLAN-Netzwerkname (SSID)",
        }
    }

    pub fn wifi_pass_prompt(&self) -> &'static str {
        match self {
            CliLang::Fr => "Mot de passe Wi-Fi (WPA2/WPA3)",
            CliLang::En => "Wi-Fi Password (WPA2/WPA3)",
            CliLang::De => "WLAN-Passwort (WPA2/WPA3)",
        }
    }

    pub fn wifi_sending(&self, port: &str) -> String {
        match self {
            CliLang::Fr => format!("Envoi de la configuration sur {}...", port),
            CliLang::En => format!("Sending configuration to {}...", port),
            CliLang::De => format!("Konfiguration wird an {} gesendet...", port),
        }
    }

    pub fn wifi_sent_success(&self) -> &'static str {
        match self {
            CliLang::Fr => "✔ Commande transmise. Le dongle va tenter de se connecter.",
            CliLang::En => "✔ Command sent. The dongle will now attempt to connect.",
            CliLang::De => "✔ Befehl gesendet. Der Dongle versucht nun, sich zu verbinden.",
        }
    }

    pub fn monitor_opening(&self, port: &str, baud: u32) -> String {
        match self {
            CliLang::Fr => format!("📟 Ouverture du moniteur série sur {} à {} bauds (Ctrl+C pour quitter)...", port, baud),
            CliLang::En => format!("📟 Opening serial monitor on {} at {} baud (Ctrl+C to quit)...", port, baud),
            CliLang::De => format!("📟 Serieller Monitor wird auf {} mit {} Baud geöffnet (Strg+C zum Beenden)...", port, baud),
        }
    }

    pub fn monitor_session_end(&self) -> &'static str {
        match self {
            CliLang::Fr => "Fin de session série :",
            CliLang::En => "Serial session ended:",
            CliLang::De => "Serielle Sitzung beendet:",
        }
    }
}
