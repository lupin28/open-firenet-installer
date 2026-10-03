// Inline SVG icon set (Lucide, ISC license) replacing the previous emoji-based
// icons, whose appearance depended entirely on the host OS's emoji font.
import search from "lucide-static/icons/search.svg?raw";
import radio from "lucide-static/icons/radio.svg?raw";
import zap from "lucide-static/icons/zap.svg?raw";
import wifi from "lucide-static/icons/wifi.svg?raw";
import packageIcon from "lucide-static/icons/package.svg?raw";
import refreshCw from "lucide-static/icons/refresh-cw.svg?raw";
import rocket from "lucide-static/icons/rocket.svg?raw";
import alertTriangle from "lucide-static/icons/alert-triangle.svg?raw";
import save from "lucide-static/icons/save.svg?raw";
import hardDrive from "lucide-static/icons/hard-drive.svg?raw";
import checkCircle from "lucide-static/icons/check-circle.svg?raw";
import flame from "lucide-static/icons/flame.svg?raw";
import externalLink from "lucide-static/icons/external-link.svg?raw";
import globe from "lucide-static/icons/globe.svg?raw";
import lock from "lucide-static/icons/lock.svg?raw";
import fileText from "lucide-static/icons/file-text.svg?raw";
import folderOpen from "lucide-static/icons/folder-open.svg?raw";
import info from "lucide-static/icons/info.svg?raw";
import chevronDown from "lucide-static/icons/chevron-down.svg?raw";

const ICONS = {
  search,
  radio,
  zap,
  wifi,
  package: packageIcon,
  "refresh-cw": refreshCw,
  rocket,
  "alert-triangle": alertTriangle,
  save,
  "hard-drive": hardDrive,
  "check-circle": checkCircle,
  flame,
  "external-link": externalLink,
  globe,
  lock,
  "file-text": fileText,
  "folder-open": folderOpen,
  info,
  "chevron-down": chevronDown,
};

export function icon(name) {
  const svg = ICONS[name];
  if (!svg) return "";
  // Every icon here is decorative, always paired with a visible text label
  // right next to it -- hide it from screen readers so they don't announce
  // the icon name on top of that label.
  return svg.replace("<svg", '<svg aria-hidden="true"');
}

// Populates every static `<... data-icon="name">` placeholder in the given
// root (index.html markup) with its inline SVG. Elements built dynamically
// in JS should call icon(name) directly instead.
export function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.getAttribute("data-icon"));
  });
}
