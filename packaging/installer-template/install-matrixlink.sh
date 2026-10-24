#!/usr/bin/env bash
# Opensource tip: install the Decky plugin sources ONLY.
# This is NOT a full JSAUX PIXEL product installer.
# Closed companion ELFs / Qt runtime / Codex bundles are not shipped here.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PLUGIN_SOURCE_DIR="${PLUGIN_SOURCE_DIR:-$ROOT_DIR/decky-plugin}"

if [[ -r "$SCRIPT_DIR/ui-language.sh" ]]; then
  # shellcheck source=/dev/null
  source "$SCRIPT_DIR/ui-language.sh"
else
  jsaux_init_ui_language() { JSAUX_UI_LANGUAGE=en; export JSAUX_UI_LANGUAGE; }
  jsaux_ui() { printf '%s\n' "${1:-}"; }
fi
jsaux_init_ui_language

cat <<'EOF'
============================================================
 JSAUX PIXEL opensource tip — PLUGIN SOURCES ONLY
------------------------------------------------------------
 This installer does NOT ship daemon / Studio / Qt / Codex.
 Without the official closed companion, Decky plugin CORE
 features (device, modes, assets, timers, live sync) will
 NOT work against a real matrix panel.
============================================================
EOF

for required_file in \
  "$PLUGIN_SOURCE_DIR/main.py" \
  "$PLUGIN_SOURCE_DIR/plugin.json" \
  "$PLUGIN_SOURCE_DIR/dist/index.js" \
  "$PLUGIN_SOURCE_DIR/backend/__init__.py" \
  "$PLUGIN_SOURCE_DIR/backend/client.py" \
  "$PLUGIN_SOURCE_DIR/backend/matrix_api.py"; do
  if [[ ! -f "$required_file" ]]; then
    echo "required file missing: $required_file" >&2
    exit 1
  fi
done

if [[ -e "$SCRIPT_DIR/app/bin/jsaux-matrix-daemon" ]] \
  || [[ -e "$SCRIPT_DIR/app/bin/jsaux-matrix-studio-v12" ]]; then
  echo "Refusing to install: closed companion ELFs must not ship in the opensource tip." >&2
  exit 1
fi

HOME_DIR="${SUDO_USER:+$(getent passwd "$SUDO_USER" | cut -d: -f6)}"
HOME_DIR="${HOME_DIR:-$HOME}"
PLUGIN_DEST="${PLUGIN_DEST:-$HOME_DIR/homebrew/plugins/Jsaux-Matrix-Display}"

mkdir -p "$PLUGIN_DEST"
# shellcheck disable=SC2164
cd "$PLUGIN_SOURCE_DIR"
tar -cf - \
  --exclude='README.md' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='data' \
  . | tar -xf - -C "$PLUGIN_DEST"

echo
echo "Installed Decky plugin sources to: $PLUGIN_DEST"
echo "NOT installed: closed companion (daemon/Studio) — core display features unavailable without it."
echo "Secondary-dev protocols/API: see docs/protocols/ and protocols/ in the repo tip."
echo "Configure JSAUX_DAEMON_URL only if a separately installed official companion is available."
