#!/usr/bin/env bash
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -r "$SCRIPT_DIR/ui-language.sh" ]]; then
  # shellcheck source=/dev/null
  source "$SCRIPT_DIR/ui-language.sh"
else
  # Keep an old extracted installer usable if it predates the catalog file.
  jsaux_init_ui_language() { JSAUX_UI_LANGUAGE=en; export JSAUX_UI_LANGUAGE; }
  jsaux_ui() { printf '%s' "${1:-}"; }
fi
jsaux_init_ui_language

TARGET_HOME="${HOME:-/home/deck}"
LOG_DIR="$TARGET_HOME/Desktop"
if ! mkdir -p "$LOG_DIR" 2>/dev/null; then
  LOG_DIR="$TARGET_HOME"
fi
LOG_FILE="$LOG_DIR/JSAUX-PIXEL-Install.log"

show_dialog() {
  local kind="$1"
  local message="$2"
  if command -v kdialog >/dev/null 2>&1 && \
    [[ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]]; then
    if [[ "$kind" == "success" ]]; then
      kdialog --title "JSAUX PIXEL" --passivepopup "$message" 3 2>/dev/null || true
    else
      kdialog --title "JSAUX PIXEL" --error "$message" 2>/dev/null || true
    fi
    return 0
  fi
  return 1
}

{
  jsaux_ui installer_title
  echo
  jsaux_ui install_log "$LOG_FILE"
  echo
} | tee "$LOG_FILE"

set +e
/usr/bin/bash "$SCRIPT_DIR/install-matrixlink.sh" "$@" 2>&1 | tee -a "$LOG_FILE"
INSTALL_STATUS=${PIPESTATUS[0]}
set -e

echo | tee -a "$LOG_FILE"
if [[ "$INSTALL_STATUS" -eq 0 ]]; then
  SUCCESS_MESSAGE="$(jsaux_ui install_success_dialog)"
  jsaux_ui install_success_short | tee -a "$LOG_FILE"
  if ! rm -f "$LOG_FILE"; then
    jsaux_ui install_log_delete_warning "$LOG_FILE" >&2
  fi
  if show_dialog success "$SUCCESS_MESSAGE"; then
    exit 0
  fi
else
  FAILURE_MESSAGE="$(jsaux_ui install_failure_dialog "$LOG_FILE")"
  jsaux_ui install_failure_short "$INSTALL_STATUS" | tee -a "$LOG_FILE"
  jsaux_ui install_keep_log | tee -a "$LOG_FILE"
  show_dialog failure "$FAILURE_MESSAGE" || true
fi

if [[ ! -t 0 ]]; then
  exit "$INSTALL_STATUS"
fi

echo
jsaux_ui close_prompt
read -r _
exit "$INSTALL_STATUS"
