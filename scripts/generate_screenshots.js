#!/usr/bin/env node
// ==============================================================================
// Open Firenet Installer - Automated Screenshot Generator
//
// Comment ça marche :
// 1. Démarre un serveur HTTP Node.js local temporaire servant le dossier dist/
// 2. Injecte un faux backend Tauri (Mock) au vol dans le HTML pour simuler :
//    - La détection d'un vrai poêle DOMO MultiAir sur le réseau (mDNS & IP)
//    - La présence de la clé ESP32-S3 sur le port série USB
//    - Les releases officielles GitHub avec notes de version
// 3. Démarre Chromium / Chrome en mode headless avec un port DevTools (CDP)
// 4. Se connecte en WebSocket au Chrome DevTools Protocol pour :
//    - Piloter l'UI sans framework externe (zéro dépendance Playwright/Puppeteer)
//    - Naviguer d'onglet en onglet et pré-remplir les formulaires
//    - Prendre des captures précises en 1000x757px sans bordures d'OS
// ==============================================================================

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execSync } from 'node:child_process';
import net from 'node:net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(REPO_ROOT, 'dist');
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'screenshots');

// Lecture de la version dynamique depuis package.json
const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
const APP_VERSION = pkg.version || '1.0.0';

// 1. Détection du binaire Chromium / Chrome disponible
function findBrowserBinary() {
  const envBin = process.env.CHROME_BIN || process.env.CHROMIUM_BIN;
  if (envBin && fs.existsSync(envBin)) return envBin;

  const candidates = [
    'chromium',
    'chromium-browser',
    'google-chrome',
    'google-chrome-stable',
    'brave-browser',
    'microsoft-edge',
  ];

  for (const bin of candidates) {
    try {
      const resolved = execSync(`which ${bin} 2>/dev/null`, { encoding: 'utf8' }).trim();
      if (resolved && fs.existsSync(resolved)) return resolved;
    } catch {
      // Ignorer et tester le suivant
    }
  }
  return null;
}

// 2. Recherche d'un port TCP libre
function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

// 3. Données réalistes pour simuler l'écosystème Open Firenet
const mockDongle = [
  {
    ip: '192.168.1.93',
    hostname: 'openfirenet.local',
    firmware_version: 'v2.0.1',
    stove_model: 'DOMO MultiAir',
    stove_state: 'Heating',
    wifi_rssi: '-62 dBm',
  },
];

const mockReleases = [
  {
    tag_name: 'v2.0.1',
    name: 'v2.0.1 - Performance & Stability Update',
    body: "### What's Changed\n- Improved Wi-Fi reconnection handling and stability\n- Added active reboot & online polling after OTA update\n- Optimized pellet feeder and temperature sensor polling\n- Added multi-language support (EN, FR, DE)",
    prerelease: false,
    assets: [
      {
        name: 'open-firenet-v2.0.1-factory.bin',
        browser_download_url: 'https://github.com/openfirenet/open-firenet/releases/download/v2.0.1/open-firenet-v2.0.1-factory.bin',
        size: 1845120,
      },
      {
        name: 'open-firenet-v2.0.1-ota.bin',
        browser_download_url: 'https://github.com/openfirenet/open-firenet/releases/download/v2.0.1/open-firenet-v2.0.1-ota.bin',
        size: 1284560,
      },
      {
        name: 'SHA256SUMS',
        browser_download_url: 'https://github.com/openfirenet/open-firenet/releases/download/v2.0.1/SHA256SUMS',
        size: 256,
      },
    ],
  },
  {
    tag_name: 'v2.0.0',
    name: 'v2.0.0 - Major ESP32-S3 Release',
    body: '### Initial Stable ESP32-S3 Release\n- Native ESP32-S3 hardware support replacing original RIKA Firenet dongle\n- Real-time Home Assistant MQTT autodiscovery\n- Embedded Web UI and REST API',
    prerelease: false,
    assets: [
      {
        name: 'open-firenet-v2.0.0-factory.bin',
        browser_download_url: 'https://github.com/openfirenet/open-firenet/releases/download/v2.0.0/open-firenet-v2.0.0-factory.bin',
        size: 1840000,
      },
      {
        name: 'open-firenet-v2.0.0-ota.bin',
        browser_download_url: 'https://github.com/openfirenet/open-firenet/releases/download/v2.0.0/open-firenet-v2.0.0-ota.bin',
        size: 1280000,
      },
    ],
  },
];

const mockPorts = [
  {
    port_name: '/dev/ttyACM0',
    description: 'Espressif USB JTAG/serial debug unit (ESP32-S3)',
  },
  {
    port_name: '/dev/ttyUSB0',
    description: 'CP2102 USB to UART Bridge Controller',
  },
];

// 4. Script JavaScript injecté dans la page pour mocker Tauri 2.x
const mockScript = `
<script>
  window.localStorage.setItem('openfirenet_lang', 'en');
  const mockInvoke = async (cmd, args) => {
    console.log('[Tauri Mock] Invoke:', cmd, args);
    if (cmd === 'get_app_version') return '${APP_VERSION}';
    if (cmd === 'scan_network') return ${JSON.stringify(mockDongle)};
    if (cmd === 'get_releases') return ${JSON.stringify(mockReleases)};
    if (cmd === 'list_serial_ports') return ${JSON.stringify(mockPorts)};
    if (cmd === 'plugin:event|listen') return 1;
    return null;
  };

  // Support Tauri v2 & v1
  window.__TAURI_INTERNALS__ = { invoke: mockInvoke };
  window.__TAURI__ = { core: { invoke: mockInvoke }, event: { listen: () => Promise.resolve(() => {}) } };
</script>
<style>
  /* Cacher les barres de défilement pour un rendu visuel net */
  *::-webkit-scrollbar { display: none !important; width: 0 !important; }
  * { scrollbar-width: none !important; }
</style>
`;

async function main() {
  console.log('\n🔥 \x1b[1m\x1b[36m=== Open Firenet Screenshot Automation ===\x1b[0m\n');

  // Vérifier ou compiler le frontend
  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.log('📦 Frontend non compilé. Exécution de `npm run build`...');
    execSync('npm run build', { cwd: REPO_ROOT, stdio: 'inherit' });
  }

  const browserBin = findBrowserBinary();
  if (!browserBin) {
    console.error('❌ Erreur : Aucun navigateur Chromium ou Chrome trouvé sur le système.');
    console.error('   Veuillez installer chromium (ex: sudo apt install chromium) ou définir CHROME_BIN.');
    process.exit(1);
  }
  console.log(`🌐 Navigateur détecté : \x1b[32m${browserBin}\x1b[0m`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const httpPort = await getFreePort();
  const cdpPort = await getFreePort();

  // 5. Démarrage du serveur HTTP local
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(DIST_DIR, reqPath);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    let content = fs.readFileSync(filePath);
    let contentType = 'text/plain';
    if (filePath.endsWith('.html')) {
      contentType = 'text/html';
      content = content.toString().replace('<head>', '<head>' + mockScript);
    } else if (filePath.endsWith('.js')) {
      contentType = 'application/javascript';
    } else if (filePath.endsWith('.css')) {
      contentType = 'text/css';
    } else if (filePath.endsWith('.png')) {
      contentType = 'image/png';
    } else if (filePath.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });

  await new Promise((resolve) => server.listen(httpPort, '127.0.0.1', resolve));
  console.log(`📡 Serveur statique avec mock Tauri actif sur http://127.0.0.1:${httpPort}`);

  // 6. Lancement de Chromium en mode headless avec port de débogage CDP
  console.log(`🚀 Démarrage de Chromium Headless (CDP port ${cdpPort})...`);
  const chromeProc = spawn(browserBin, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${cdpPort}`,
    '--window-size=1000,900',
    `http://127.0.0.1:${httpPort}`,
  ]);

  // Gestion des signaux pour tuer proprement les process enfants
  const cleanup = () => {
    try { chromeProc.kill('SIGKILL'); } catch {}
    try { server.close(); } catch {}
  };
  process.on('SIGINT', () => { cleanup(); process.exit(1); });
  process.on('SIGTERM', () => { cleanup(); process.exit(1); });

  // Attendre que le port CDP soit prêt
  let tabs = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch {}
  }

  if (!tabs || tabs.length === 0) {
    cleanup();
    throw new Error('Impossible de se connecter au port de débogage Chromium.');
  }

  const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgIdCounter = 1;
  function sendCdp(method, params = {}) {
    return new Promise((resolve) => {
      const currentId = msgIdCounter++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === currentId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: currentId, method, params }));
    });
  }

  try {
    await sendCdp('Page.enable');
    await sendCdp('Runtime.enable');

    // Attente du rendu initial de Vite et de l'exécution du mock scan_network
    await new Promise((r) => setTimeout(r, 1500));

    // Forcer la sélection de la langue anglaise si le sélecteur existe
    await sendCdp('Runtime.evaluate', {
      expression: `
        const select = document.getElementById('lang-select');
        if (select && select.value !== 'en') {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
      `,
    });
    await new Promise((r) => setTimeout(r, 400));

    const captures = [
      {
        name: 'dashboard-scan.png',
        label: '1. Tableau de bord / Détection du poêle',
        prepare: null,
      },
      {
        name: 'ota-update.png',
        label: '2. Mise à jour sans fil (OTA)',
        prepare: `
          const tab = document.querySelector('[data-tab="tab-ota"]');
          if (tab) tab.click();
          const ip = document.getElementById('ota-ip');
          if (ip) {
            ip.value = '192.168.1.93';
            ip.dispatchEvent(new Event('input'));
          }
        `,
      },
      {
        name: 'usb-flasher.png',
        label: '3. Flasher USB Série',
        prepare: `
          const tab = document.querySelector('[data-tab="tab-usb"]');
          if (tab) tab.click();
        `,
      },
      {
        name: 'wifi-setup.png',
        label: '4. Assistant Wi-Fi',
        prepare: `
          const tab = document.querySelector('[data-tab="tab-wifi"]');
          if (tab) tab.click();
          const ssid = document.getElementById('wifi-ssid');
          if (ssid) {
            ssid.value = 'Home-LivingRoom-WiFi';
            ssid.dispatchEvent(new Event('input'));
          }
        `,
      },
      {
        name: 'releases.png',
        label: '5. Releases officielles GitHub',
        prepare: `
          const tab = document.querySelector('[data-tab="tab-releases"]');
          if (tab) tab.click();
        `,
      },
    ];

    console.log('\n📸 Prise des captures d\'écran en cours...\n');

    for (const item of captures) {
      if (item.prepare) {
        // Wrapped in an IIFE: Runtime.evaluate runs against the page's real
        // global scope, and separate evaluate calls share that scope -- a
        // bare `const tab = ...` in each prepare script collides with the
        // previous capture's `const tab`, throwing a silent SyntaxError that
        // skips the whole script (tab never switches, next screenshot is a
        // byte-for-byte duplicate of the previous one).
        const result = await sendCdp('Runtime.evaluate', {
          expression: `(() => {\n${item.prepare}\n})()`,
        });
        if (result && result.exceptionDetails) {
          console.error(`  ⚠ prepare script failed for ${item.name}:`, result.exceptionDetails.text);
        }
        await new Promise((r) => setTimeout(r, 500));
      }

      const snap = await sendCdp('Page.captureScreenshot', { format: 'png' });
      const destPath = path.join(OUT_DIR, item.name);
      fs.writeFileSync(destPath, Buffer.from(snap.data, 'base64'));
      const sizeKb = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`  ✔ ${item.label.padEnd(42)} ➔ docs/screenshots/${item.name} (${sizeKb} Ko)`);
    }

    console.log('\n\x1b[32m\x1b[1m✔ Toutes les captures ont été générées avec succès !\x1b[0m\n');
    ws.close();
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error('\n❌ Erreur fatale lors de la génération des captures :', err);
  process.exit(1);
});
