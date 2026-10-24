# Replace the official Decky plugin with this opensource tip

Both the official closed installer and this opensource tip install the Decky
plugin into the same directory:

`~/homebrew/plugins/Jsaux-Matrix-Display`

That means: if you already installed the **official JSAUX PIXEL release**, you
can overlay this tip’s plugin sources and keep using the closed companion
daemon/Studio for hardware I/O.

## Steps

1. Install the official product first (companion + plugin) from the
   [Steam Machine faceplate app installation guide](https://jsaux.com/pages/steam-machine-faceplate-app-installation-guide).
2. Confirm Decky shows **JSAUX PIXEL** and the panel works.
3. From this repository’s `packaging/installer-template/`, run
   **Install Decky Plugin (opensource).desktop** (or `./install-matrixlink.sh`).
   It copies this tip’s `decky-plugin/` contents into
   `~/homebrew/plugins/Jsaux-Matrix-Display`.
4. Restart Decky Loader (or reboot SteamOS desktop / Gaming mode as you usually do).
5. Edit `~/homebrew/plugins/Jsaux-Matrix-Display/main.py` (or work from a clone and
   re-run the install helper) to try orchestration changes.

## Roll back

Use **Remove Decky Plugin (opensource).desktop**, then reinstall the official
plugin from the closed release if you want the stock plugin tree back. The
closed companion binaries are not removed by the opensource remove helper unless
you previously installed them via a closed package (see that package’s uninstall).

## Notes

- Without the closed companion, most Decky product UX still cannot drive hardware.
- AI Agent shows local Codex session name + running state only (no OAuth / usage APIs).
