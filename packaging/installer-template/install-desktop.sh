#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Compatibility entry point retained for older release instructions.
exec "$SCRIPT_DIR/install-matrixlink.sh" "$@"
