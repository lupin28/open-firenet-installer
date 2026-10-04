use colored::*;
use serde::{Deserialize, Serialize};
use std::net::{SocketAddr, TcpStream, ToSocketAddrs};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiscoveredDongle {
    pub ip: String,
    pub hostname: String,
    pub firmware_version: String,
    pub stove_model: String,
    pub stove_state: String,
    pub wifi_rssi: String,
}

#[derive(Deserialize)]
struct ApiDevice {
    version: Option<String>,
    app_version: Option<String>,
    firmware_version: Option<String>,
    wifi_rssi: Option<i32>,
}

#[derive(Deserialize)]
struct ApiVersion {
    version: Option<String>,
}

#[derive(Deserialize)]
struct ApiStove {
    model_name: Option<String>,
    main_state: Option<i32>,
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct ApiState {
    device: Option<ApiDevice>,
    stove: Option<ApiStove>,
    model_name: Option<String>,
    model: Option<i32>,
    firmware_version: Option<String>,
    version: Option<String>,
}

pub struct NetworkScanner;

impl NetworkScanner {
    /// Tente de contacter Open Firenet via les noms mDNS par défaut
    pub fn probe_mdns_hosts() -> Vec<DiscoveredDongle> {
        let mut results = Vec::new();
        let candidates = ["openfirenet.local:80", "open-firenet.local:80"];

        for target in &candidates {
            if let Ok(mut addrs) = target.to_socket_addrs() {
                if let Some(addr) = addrs.next() {
                    let ip = addr.ip().to_string();
                    if let Some(dongle) = Self::probe_ip(&ip) {
                        results.push(dongle);
                    }
                }
            }
        }
        results
    }

    /// Sonde une adresse IP spécifique pour vérifier si c'est un dongle Open Firenet
    pub fn probe_ip(ip: &str) -> Option<DiscoveredDongle> {
        let socket_addr: SocketAddr = format!("{}:80", ip).parse().ok()?;
        if TcpStream::connect_timeout(&socket_addr, Duration::from_millis(600)).is_err() {
            return None;
        }

        let url = format!("http://{}/api/state", ip);
        let resp = ureq::get(&url)
            .timeout(Duration::from_millis(1500))
            .call()
            .ok()?;

        if resp.status() == 200 {
            if let Ok(state) = resp.into_json::<ApiState>() {
                let mut fw_ver = state.device.as_ref()
                    .and_then(|d| d.version.clone().or_else(|| d.app_version.clone()).or_else(|| d.firmware_version.clone()))
                    .or_else(|| state.firmware_version.clone())
                    .or_else(|| state.version.clone());

                if fw_ver.is_none() {
                    let ver_url = format!("http://{}/api/version", ip);
                    if let Ok(ver_resp) = ureq::get(&ver_url).timeout(Duration::from_millis(800)).call() {
                        if let Ok(api_ver) = ver_resp.into_json::<ApiVersion>() {
                            fw_ver = api_ver.version;
                        }
                    }
                }

                let fw_ver_str = fw_ver.unwrap_or_else(|| "Inconnue".to_string());
                
                let model = state.model_name
                    .or_else(|| state.stove.as_ref().and_then(|s| s.model_name.clone()))
                    .unwrap_or_else(|| "RIKA".to_string());

                let st = state.stove.as_ref()
                    .and_then(|s| s.main_state)
                    .map(|code| match code {
                        0 => "Standby",
                        1 => "Allumage",
                        2 => "Démarrage",
                        3 => "Régulation",
                        4 => "Nettoyage",
                        5 => "Arrêt",
                        _ => "Inconnu"
                    }.to_string())
                    .unwrap_or_else(|| "--".to_string());

                let rssi = state.device.as_ref()
                    .and_then(|d| d.wifi_rssi)
                    .map(|r| format!("{} dBm", r))
                    .unwrap_or_else(|| "--".to_string());

                return Some(DiscoveredDongle {
                    ip: ip.to_string(),
                    hostname: "openfirenet.local".to_string(),
                    firmware_version: fw_ver_str,
                    stove_model: model,
                    stove_state: st,
                    wifi_rssi: rssi,
                });
            }
        }
        None
    }

    /// Effectue un scan rapide en parallèle sur le sous-réseau local (ex: 192.168.1.1..254)
    pub fn scan_subnet(base_prefix: &str) -> Vec<DiscoveredDongle> {
        let results = Arc::new(Mutex::new(Vec::new()));
        let mut handles = Vec::new();

        println!("{} {}", "🔍 Scan du sous-réseau :".cyan().bold(), format!("{}.1 - {}.254", base_prefix, base_prefix).yellow());

        for i in 1..=254 {
            let ip = format!("{}.{}", base_prefix, i);
            let results_clone = Arc::clone(&results);

            let handle = thread::spawn(move || {
                let socket_addr: SocketAddr = match format!("{}:80", ip).parse() {
                    Ok(a) => a,
                    Err(_) => return,
                };
                if TcpStream::connect_timeout(&socket_addr, Duration::from_millis(300)).is_ok() {
                    if let Some(dongle) = NetworkScanner::probe_ip(&ip) {
                        let mut r = results_clone.lock().unwrap();
                        r.push(dongle);
                    }
                }
            });
            handles.push(handle);

            if handles.len() >= 64 {
                for h in handles.drain(..) {
                    let _ = h.join();
                }
            }
        }

        for h in handles {
            let _ = h.join();
        }

        let res = results.lock().unwrap().clone();
        res
    }

    /// Tente de détecter les préfixes réseaux locaux courants (ex: 192.168.1)
    pub fn detect_local_prefixes() -> Vec<String> {
        vec![
            "192.168.1".to_string(),
            "192.168.0".to_string(),
            "192.168.4".to_string(), // Mode AP de secours OpenFirenet
        ]
    }
}
