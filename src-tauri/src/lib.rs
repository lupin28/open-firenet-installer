use tauri::{AppHandle, Emitter};
use std::path::PathBuf;

pub mod cli_i18n;
pub mod discovery;
pub mod flasher_ota;
pub mod flasher_serial;
pub mod github;
pub mod wifi_setup;

use discovery::{DiscoveredDongle, NetworkScanner};
use flasher_serial::{DetectedPort, SerialFlasher};
use github::{GitHubClient, Release};

#[tauri::command]
async fn scan_network() -> Result<Vec<DiscoveredDongle>, String> {
    tauri::async_runtime::spawn_blocking(|| {
        let mut devices = NetworkScanner::probe_mdns_hosts();
        if devices.is_empty() {
            devices = NetworkScanner::scan_subnet("192.168.1");
        }
        devices
    })
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_releases() -> Result<Vec<Release>, String> {
    tauri::async_runtime::spawn_blocking(|| {
        let client = GitHubClient::new();
        client.list_releases().unwrap_or_default()
    })
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn list_serial_ports() -> Result<Vec<DetectedPort>, String> {
    tauri::async_runtime::spawn_blocking(|| {
        SerialFlasher::list_ports().unwrap_or_default()
    })
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn flash_usb_device(
    app: AppHandle,
    port: String,
    release_tag: Option<String>,
    custom_file: Option<String>,
    mode: Option<String>,
) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let is_update = mode.as_deref().unwrap_or("update") == "update";
        let offset = if is_update { "0x10000" } else { "0x0000" };

        let bin_path = if let Some(path) = custom_file {
            PathBuf::from(path)
        } else if let Some(tag) = release_tag {
            let client = GitHubClient::new();
            let releases = client.list_releases().map_err(|e| e.to_string())?;
            let release = releases.into_iter().find(|r| r.tag_name == tag)
                .ok_or_else(|| format!("Release {} introuvable", tag))?;
            let asset = if is_update {
                release.ota_asset()
                    .ok_or_else(|| "Aucun binaire de mise à jour (OTA/app) trouvé pour cette release".to_string())?
            } else {
                release.factory_asset()
                    .ok_or_else(|| "Aucun binaire factory trouvé pour cette release".to_string())?
            };
            let _ = app.emit("flash-status", "Téléchargement et vérification cryptographique Minisign...");
            let dest = client.download_and_verify_asset(&release, asset).map_err(|e| e.to_string())?;
            dest
        } else {
            return Err("Veuillez choisir une version ou un fichier local".to_string());
        };

        let app_handle = app.clone();
        let _ = app.emit("flash-progress", serde_json::json!({
            "percent": 5,
            "message": "Flashage en cours sur le port USB..."
        }));
        SerialFlasher::flash_usb_bin(&port, &bin_path, offset, 921600, move |pct, msg| {
            let _ = app_handle.emit("flash-progress", serde_json::json!({
                "percent": pct,
                "message": msg
            }));
        }).map_err(|e| e.to_string())?;
        let _ = app.emit("flash-status", "Flashage terminé avec succès !");
        Ok("Flashage terminé avec succès ! La clé redémarre.".to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn update_ota_device(
    app: AppHandle,
    ip: String,
    release_tag: Option<String>,
    custom_file: Option<String>,
) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let bin_path = if let Some(path) = custom_file {
            PathBuf::from(path)
        } else if let Some(tag) = release_tag {
            let client = GitHubClient::new();
            let releases = client.list_releases().map_err(|e| e.to_string())?;
            let release = releases.into_iter().find(|r| r.tag_name == tag)
                .ok_or_else(|| format!("Release {} introuvable", tag))?;
            let asset = release.ota_asset()
                .ok_or_else(|| "Aucun binaire OTA trouvé pour cette release".to_string())?;
            let _ = app.emit("ota-status", "Téléchargement et vérification cryptographique Minisign...");
            let dest = client.download_and_verify_asset(&release, asset).map_err(|e| e.to_string())?;
            dest
        } else {
            return Err("Veuillez choisir une version ou un fichier local".to_string());
        };

        let app_handle = app.clone();
        let _ = app.emit("ota-progress", serde_json::json!({
            "percent": 5,
            "message": "Envoi du firmware via Wi-Fi (ArduinoOTA)..."
        }));
        flasher_ota::OtaFlasher::flash_arduino_ota(&ip, &bin_path, move |pct, msg| {
            let _ = app_handle.emit("ota-progress", serde_json::json!({
                "percent": pct,
                "message": msg
            }));
        }).map_err(ota_error_for_window)?;
        let _ = app.emit("ota-status", "✔ La clé a redémarré et est de nouveau en ligne !");
        Ok("Mise à jour réussie ! La clé a redémarré et est de nouveau en ligne.".to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

/// A failure the window translates is sent as `i18n:` + JSON (`key`, values); any other error as its text.
fn ota_error_for_window(error: anyhow::Error) -> String {
    use flasher_ota::{OtaFailure, OtaFlasher};
    match error.downcast_ref::<OtaFailure>() {
        Some(OtaFailure::SlotTooSmall { firmware_bytes, slot_bytes }) => format!("i18n:{}", serde_json::json!({
            "key": "otaErrSlotTooSmall", "firmware": firmware_bytes, "slot": slot_bytes
        })),
        Some(OtaFailure::NoTcpConnection { port, firmware_bytes, slot_may_be_too_small }) => format!("i18n:{}", serde_json::json!({
            "key": "otaErrNoConnection", "port": port,
            "also": if *slot_may_be_too_small { Some("otaErrSlotMaybeTooSmall") } else { None },
            "firmware": firmware_bytes, "slot": OtaFlasher::DEFAULT_SCHEME_SLOT_BYTES
        })),
        None => error.to_string(),
    }
}

#[tauri::command]
fn get_app_version(app: tauri::AppHandle) -> String {
    app.package_info().version.to_string()
}

#[tauri::command]
fn configure_wifi(
    port: String,
    ssid: String,
    password: String,
) -> Result<String, String> {
    wifi_setup::WifiSetup::send_credentials(&port, &ssid, &password).map_err(|e| e.to_string())?;
    Ok("Configuration Wi-Fi envoyée avec succès !".to_string())
}

#[tauri::command]
fn open_browser_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&url)
            .spawn()
            .map_err(|e| format!("Impossible d'ouvrir le navigateur : {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(["/C", "start", &url])
            .spawn()
            .map_err(|e| format!("Impossible d'ouvrir le navigateur : {}", e))?;
    }
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&url)
            .spawn()
            .map_err(|e| format!("Impossible d'ouvrir le navigateur : {}", e))?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            scan_network,
            get_releases,
            list_serial_ports,
            flash_usb_device,
            update_ota_device,
            configure_wifi,
            open_browser_url,
            get_app_version
        ])
        .run(tauri::generate_context!())
        .expect("erreur lors du lancement de l'interface graphique");
}
