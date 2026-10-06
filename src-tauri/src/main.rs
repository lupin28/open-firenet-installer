mod cli_i18n;
mod discovery;
mod flasher_ota;
mod flasher_serial;
mod github;
mod wifi_setup;

use anyhow::Result;
use clap::{Parser, Subcommand};
use cli_i18n::CliLang;
use colored::*;
use dialoguer::{Confirm, Select};
use std::path::PathBuf;

use discovery::NetworkScanner;
use flasher_ota::OtaFlasher;
use flasher_serial::SerialFlasher;
use github::GitHubClient;
use wifi_setup::WifiSetup;

#[derive(Parser)]
#[command(
    name = "open-firenet-installer",
    author = "Open Firenet Community",
    version = env!("CARGO_PKG_VERSION"),
    about = "Universal installation, USB flashing and OTA update tool for Open Firenet"
)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,

    /// Lancer l'interface graphique (GUI) / Launch Graphical User Interface
    #[arg(long)]
    gui: bool,

    /// Forcer le mode menu interactif dans le terminal / Force interactive CLI terminal menu
    #[arg(long)]
    cli: bool,

    /// Langue de la CLI / CLI Language (fr, en, de)
    #[arg(short, long)]
    lang: Option<String>,
}

#[derive(Subcommand)]
enum Commands {
    /// Scanner le réseau local pour détecter la clé Open Firenet
    Scan {
        #[arg(short, long)]
        subnet: Option<String>,
    },
    /// Flasher la clé en USB série (ROM bootloader)
    Flash {
        #[arg(short, long)]
        port: Option<String>,
        #[arg(short, long)]
        file: Option<PathBuf>,
        #[arg(short, long)]
        release: Option<String>,
    },
    /// Mettre à jour la clé via Wi-Fi (OTA)
    Ota {
        #[arg(short, long)]
        ip: String,
        #[arg(short, long)]
        file: Option<PathBuf>,
        #[arg(short, long)]
        release: Option<String>,
    },
    /// Configurer les identifiants Wi-Fi via le port USB
    WifiSetup {
        #[arg(short, long)]
        port: Option<String>,
    },
    /// Lister les versions officielles sur GitHub
    ListReleases,
    /// Ouvrir le moniteur série
    Monitor {
        #[arg(short, long)]
        port: Option<String>,
        #[arg(short, long, default_value = "115200")]
        baud: u32,
    },
}

fn print_banner(lang: CliLang) {
    println!("{}", "╔═══════════════════════════════════════════════════════════════╗".cyan().bold());
    println!("{}", "║                 🔥  OPEN-FIRENET INSTALLER  🔥                ║".cyan().bold());
    println!("{}", format!("║{:^63}║", lang.banner_subtitle()).cyan().bold());
    println!("{}", "╚═══════════════════════════════════════════════════════════════╝".cyan().bold());
    println!();
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    let lang = match cli.lang.as_deref() {
        Some(l) => CliLang::from_str(l),
        None => CliLang::detect(),
    };

    match cli.command {
        Some(Commands::Scan { subnet }) => cmd_scan(subnet, lang)?,
        Some(Commands::Flash { port, file, release }) => cmd_flash(port, file, release, lang)?,
        Some(Commands::Ota { ip, file, release }) => cmd_ota(&ip, file, release, lang)?,
        Some(Commands::WifiSetup { port }) => cmd_wifi_setup(port, lang)?,
        Some(Commands::ListReleases) => cmd_list_releases(lang)?,
        Some(Commands::Monitor { port, baud }) => cmd_monitor(port, baud, lang)?,
        None => {
            if cli.cli || (std::env::var("DISPLAY").is_err() && std::env::var("WAYLAND_DISPLAY").is_err()) {
                run_interactive_menu(lang)?;
            } else {
                open_firenet_installer::run();
            }
        }
    }

    Ok(())
}

/// In the menu, a failed action is shown and the menu stays: returning the error would end the program, and on
/// Windows the window closes before the message can be read.
fn report_menu_error(result: Result<()>) {
    if let Err(e) = result {
        eprintln!("\n{} {:#}", "✖".red().bold(), e);
    }
}

fn run_interactive_menu(mut lang: CliLang) -> Result<()> {
    loop {
        print_banner(lang);

        let choices = lang.menu_choices();
        let lang_switch_opt = match lang {
            CliLang::Fr => "🌐 8. Changer de langue / Switch Language",
            CliLang::En => "🌐 8. Switch Language / Changer de langue",
            CliLang::De => "🌐 8. Sprache wechseln / Switch Language",
        };

        let mut menu_items = choices.to_vec();
        menu_items.push(lang_switch_opt);

        let selection = Select::new()
            .with_prompt(lang.menu_title())
            .items(&menu_items)
            .default(0)
            .interact()?;

        println!();

        match selection {
            0 => report_menu_error(cmd_scan(None, lang)),
            1 => report_menu_error(cmd_flash(None, None, None, lang)),
            2 => report_menu_error(interactive_ota(lang)),
            3 => report_menu_error(cmd_wifi_setup(None, lang)),
            4 => report_menu_error(cmd_list_releases(lang)),
            5 => report_menu_error(cmd_monitor(None, 115200, lang)),
            6 => {
                println!("{}", lang.goodbye());
                break;
            }
            7 => {
                let lang_opts = &["🇫🇷 Français", "🇬🇧 English", "🇩🇪 Deutsch"];
                let chosen = Select::new()
                    .with_prompt("Choisir la langue / Select language / Sprache wählen :")
                    .items(lang_opts)
                    .default(match lang {
                        CliLang::Fr => 0,
                        CliLang::En => 1,
                        CliLang::De => 2,
                    })
                    .interact()?;
                lang = match chosen {
                    0 => CliLang::Fr,
                    1 => CliLang::En,
                    2 => CliLang::De,
                    _ => CliLang::Fr,
                };
                continue;
            }
            _ => unreachable!(),
        }

        println!("\n{}", "─".repeat(60).dimmed());
        if !Confirm::new().with_prompt(lang.menu_return_prompt()).default(true).interact()? {
            break;
        }
        println!();
    }
    Ok(())
}

fn cmd_scan(subnet: Option<String>, lang: CliLang) -> Result<()> {
    println!("{}", lang.scan_searching().bold());

    // 1. Essai mDNS
    let mut found = NetworkScanner::probe_mdns_hosts();

    // 2. Essai subnet si non trouvé ou demandé
    if found.is_empty() {
        let prefixes = if let Some(s) = subnet {
            vec![s]
        } else {
            NetworkScanner::detect_local_prefixes()
        };

        for prefix in prefixes {
            let res = NetworkScanner::scan_subnet(&prefix);
            found.extend(res);
            if !found.is_empty() { break; }
        }
    }

    if found.is_empty() {
        println!("{}", lang.scan_not_found().red().bold());
        for line in lang.scan_tips() {
            println!("{}", line);
        }
    } else {
        println!("{}", lang.scan_found(found.len()).green().bold());
        for (i, d) in found.iter().enumerate() {
            println!("\n  [{}] {}: {}", i + 1, lang.label_ip(), d.ip.cyan().bold());
            println!("      {}: {}", lang.label_hostname(), d.hostname.dimmed());
            println!("      {}: {}", lang.label_stove_model(), d.stove_model.yellow().bold());
            println!("      {}: {}", lang.label_stove_state(), d.stove_state.white());
            println!("      {}: {}", lang.label_wifi_signal(), d.wifi_rssi);
            println!("      {}: {}", lang.label_firmware_version(), d.firmware_version);
            println!("      {}: http://{}/", lang.label_web_access(), d.ip);
        }
    }
    Ok(())
}

fn cmd_flash(port: Option<String>, file: Option<PathBuf>, release: Option<String>, lang: CliLang) -> Result<()> {
    println!("{}", lang.flash_usb_title().bold());
    println!("{}\n", lang.usb_native_hint().dimmed());

    let selected_port = choose_serial_port(port, lang)?;
    let bin_path = if let Some(f) = file {
        f
    } else {
        choose_or_download_firmware(true, release, lang)?
    };

    SerialFlasher::flash_factory_bin(&selected_port, &bin_path, 460800, |_pct, _msg| {})?;
    println!("\n{}", lang.usb_post_flash_hint().cyan());
    Ok(())
}

fn cmd_ota(ip: &str, file: Option<PathBuf>, release: Option<String>, lang: CliLang) -> Result<()> {
    println!("{}", lang.ota_updating_to(ip).bold());

    let bin_path = if let Some(f) = file {
        f
    } else {
        choose_or_download_firmware(false, release, lang)?
    };

    OtaFlasher::flash_arduino_ota(ip, &bin_path, |_pct, _msg| {})?;
    Ok(())
}

fn cmd_wifi_setup(port: Option<String>, lang: CliLang) -> Result<()> {
    let selected_port = choose_serial_port(port, lang)?;
    WifiSetup::prompt_and_configure(&selected_port, lang)
}

fn choose_serial_port(explicit: Option<String>, lang: CliLang) -> Result<String> {
    if let Some(p) = explicit {
        return Ok(p);
    }
    let ports = SerialFlasher::list_ports()?;
    if ports.is_empty() {
        anyhow::bail!("{}\n{}", lang.no_serial_port_found(), lang.usb_native_hint().dimmed());
    }

    let port_items: Vec<String> = ports.iter()
        .map(|p| format!("{} - {}", p.port_name.cyan(), p.description))
        .collect();

    let idx = Select::new()
        .with_prompt(lang.select_serial_port())
        .items(&port_items)
        .default(0)
        .interact()?;

    Ok(ports[idx].port_name.clone())
}

fn interactive_ota(lang: CliLang) -> Result<()> {
    let mut found = NetworkScanner::probe_mdns_hosts();
    if found.is_empty() {
        for prefix in NetworkScanner::detect_local_prefixes() {
            found.extend(NetworkScanner::scan_subnet(&prefix));
            if !found.is_empty() { break; }
        }
    }

    let ip = if !found.is_empty() {
        let items: Vec<String> = found.iter()
            .map(|d| format!("{} (Poêle {}, Version {})", d.ip, d.stove_model, d.firmware_version))
            .collect();
        let idx = Select::new()
            .with_prompt(lang.select_dongle_to_update())
            .items(&items)
            .default(0)
            .interact()?;
        found[idx].ip.clone()
    } else {
        dialoguer::Input::new()
            .with_prompt(lang.enter_ip_prompt())
            .interact_text()?
    };

    cmd_ota(&ip, None, None, lang)
}

fn choose_or_download_firmware(factory: bool, release_tag: Option<String>, lang: CliLang) -> Result<PathBuf> {
    let gh = GitHubClient::new();
    let cache_dir = GitHubClient::cache_dir();
    std::fs::create_dir_all(&cache_dir)?;

    let rel = if let Some(tag) = release_tag {
        let releases = gh.list_releases()?;
        releases.into_iter().find(|r| r.tag_name == tag)
            .ok_or_else(|| anyhow::anyhow!("Version {} introuvable sur GitHub", tag))?
    } else {
        println!("{}", lang.fetching_releases().dimmed());
        let releases = gh.list_releases().unwrap_or_default();
        if releases.is_empty() {
            println!("{}", lang.no_releases_found().yellow());
            let path_str: String = dialoguer::Input::new()
                .with_prompt(lang.enter_bin_path_prompt())
                .interact_text()?;
            return Ok(PathBuf::from(path_str));
        }

        let items: Vec<String> = releases.iter().map(|r| {
            let label = if r.prerelease { lang.badge_prerelease() } else { lang.badge_stable() };
            format!("{} - {}{}", r.tag_name, r.name.as_deref().unwrap_or(""), label)
        }).collect();

        let idx = Select::new()
            .with_prompt(lang.choose_version_prompt())
            .items(&items)
            .default(0)
            .interact()?;
        releases[idx].clone()
    };

    let asset = if factory {
        rel.factory_asset()
    } else {
        rel.ota_asset()
    };

    let asset = match asset {
        Some(a) => a,
        None => {
            println!("{}", lang.no_binary_found().yellow());
            let path_str: String = dialoguer::Input::new()
                .with_prompt(lang.enter_bin_path_prompt())
                .interact_text()?;
            return Ok(PathBuf::from(path_str));
        }
    };

    let release_cache_dir = cache_dir.join(&rel.tag_name);
    let dest = release_cache_dir.join(&asset.name);
    if dest.exists() {
        if Confirm::new().with_prompt(lang.use_cached_prompt(&asset.name)).default(true).interact()? {
            return Ok(dest);
        }
    }

    println!("{}", lang.downloading_asset(&asset.name).cyan());
    let verified_dest = gh.download_and_verify_asset(&rel, asset)?;
    println!("{}", lang.verification_ok().green());
    Ok(verified_dest)
}

fn cmd_list_releases(lang: CliLang) -> Result<()> {
    let gh = GitHubClient::new();
    println!("{}", lang.releases_title().bold());

    match gh.list_releases() {
        Ok(releases) if releases.is_empty() => {
            println!("{}", lang.no_releases_found().yellow());
        }
        Ok(releases) => {
            for r in releases {
                let badge = if r.prerelease { "[BÊTA/TEST]".yellow() } else { "[STABLE]".green() };
                println!("\n  {} {} - {}", badge, r.tag_name.bold(), r.name.unwrap_or_default());
                for a in r.assets {
                    let size_mb = a.size as f64 / (1024.0 * 1024.0);
                    println!("    • {} ({:.2} Mo)", a.name.dimmed(), size_mb);
                }
            }
        }
        Err(e) => {
            println!("{} Impossible de contacter l'API GitHub : {}", "❌".red(), e);
        }
    }
    Ok(())
}

fn cmd_monitor(port: Option<String>, baud: u32, lang: CliLang) -> Result<()> {
    let selected_port = choose_serial_port(port, lang)?;
    WifiSetup::monitor_serial(&selected_port, baud, lang)
}
