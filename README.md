# External DAGR Bridge
### Arma 3 Telemetry Companion

External DAGR Bridge connects Arma 3 live telemetry to a companion interface, providing real-time map, marker, and navigation data.

- This repository provides the **local bridge server + app** (open source).
- The **in-game addon** is distributed separately via Steam Workshop.

> 📦 **Workshop item:** [External DAGR Bridge](https://steamcommunity.com/sharedfiles/filedetails/?id=3700274411)

---

## Features

- Real-time telemetry from Arma 3
- Live map and marker synchronization
- Local bridge service (HTTP/WebSocket)
- Companion UI launcher with connection status
- Open-source workflow for customization

---

## Requirements

- [Arma 3](https://store.steampowered.com/app/107410/Arma_3/)
- [Node.js](https://nodejs.org) (for the local bridge/app)
- Recommended: [ExtractPbo](https://mikero.bytex.digital/Downloads) for best map extraction quality

---

## Setup Instructions

### Step 1 — Install a PBO Extractor

Download `ExtractPbo.exe` from:
👉 https://mikero.bytex.digital/Downloads

> If you've ever made Arma missions, you likely already have this.

---

### Step 2 — Subscribe to the Workshop Mod

Subscribe and enable **@microdagr_bridge** in the Arma 3 Launcher:
👉 https://steamcommunity.com/sharedfiles/filedetails/?id=3700274411

---

### Step 3 — Download This Repo (Bridge + App)

Clone or download this repository, then open the root folder and continue below.

---

### Step 4 — Run the Automatic Setup

**4.1** Run `Install_All.bat`

**4.2** Run `Start_Launcher.bat` — a launcher window should appear.

In the launcher window, click **Start All**.

- Launch Arma 3 with the **@microdagr_bridge** mod enabled.
- Open the local or network app link shown in the launcher.

---

## Alternative Methods *(if the above fails)*

### Manual Dependency Installation
> Only if `Install_All.bat` fails:
```bash
# In arma-bridge/
npm install

# In microdagr-app/
npm install
```

### Manual Startup
> Only if `Start_Launcher.bat` fails:

- Run `Start_Bridge.bat`
- Run `Start_App.bat`

---

## Notes

- All data is processed **locally on your PC** (LAN/local usage only).
- Some advanced telemetry integrations are improved when **ACE/CBA** features are available.

---

## License

[AGPL-3.0](LICENSE)

# External DAGR Bridge Workspace

This workspace connects Arma 3 telemetry to a local web/mobile UI that mimics a MicroDAGR-style experience.

## Components

| Component | Folder / File | Purpose |
|---|---|---|
| Arma addon | `@microdagr_bridge/` | SQF addon that writes telemetry to Arma `.rpt` logs. |
| Telemetry bridge | `arma-bridge/` | Node.js HTTP/WebSocket server that reads `.rpt`, serves telemetry, and builds map assets. |
| Frontend app | `microdagr-app/` | React + Vite UI that connects to bridge WebSocket and renders map/markers. |
| One-click launchers | `Start_All.bat`, `Start_Bridge.bat`, `Start_App.bat` | Start scripts for bridge and app. |
| One-click setup | `Install_All.bat`, `Install_All.ps1` | Installs project dependencies and checks tool prerequisites. |
| GUI launcher | `MicroDAGR_Launcher.ps1`, `Start_Launcher.bat` | Small desktop launcher UI with status indicators and links. |
| EXE builder (optional) | `Build_Launcher_EXE.bat` | Builds `MicroDAGR_Launcher.exe` from PowerShell launcher script. |

## What Is Required For It To Work

Required runtime pieces:
- `@microdagr_bridge/`
- `arma-bridge/`
- `microdagr-app/`
- Node.js (LTS recommended)
- Arma 3 running with `@microdagr_bridge` loaded

Recommended (for best map extraction):
- A PBO extractor (`ExtractPbo.exe` / Mikero / Arma 3 Tools)
- A PAA converter (`PaaToPng.exe` or similar)

Extractor compatibility note:
- Not every extractor works out of the box.
- Built-in auto-detection supports `ExtractPbo.exe` variants and local `pboc.exe`.
- If you use a different extractor binary, set `MICRODAGR_PBO_EXTRACT_CMD` manually with `{input}` and `{output}` placeholders.

Notes:
- The bridge can fall back to internal conversion paths, but missing external tools may reduce map quality/coverage on some terrains.
- ACE/CBA are not hard-required by `config.cpp`, but ACE/CBA-related telemetry features are used when available.

## Quick Start (Recommended)

1. Install a PBO extractor first:
   - Download `ExtractPbo.exe` (or equivalent Mikero tool) from: https://mikero.bytex.digital/Downloads
2. Run one-click setup:
   - Run `Install_All.bat`
3. Start the launcher UI:
   - Run `Start_Launcher.bat`
4. In the launcher window, click `Start All`.
5. Start Arma 3 with `@microdagr_bridge` enabled.
6. Open the Local or Network app link shown in launcher.

Manual dependency install (alternative):
- In `arma-bridge/`: `npm install`
- In `microdagr-app/`: `npm install`

## Alternative Start Methods

### Option A: Classic bat launcher
- Run `Start_All.bat`

### Option B: Separate terminals
- Run `Start_Bridge.bat`
- Run `Start_App.bat`

## Arma Addon Packaging / Update

If you changed addon source files, rebuild the PBO before testing in game.

Source folder:
- `@microdagr_bridge/addons/microdagr_bridge`

Output folder:
- `@microdagr_bridge/addons`

Expected runtime PBO:
- `@microdagr_bridge/addons/microdagr_bridge.pbo`

`Start_Bridge.bat` already warns if source files are newer than the PBO.

## Connectivity Checks

Bridge health endpoint:
- `http://127.0.0.1:8080/health`

Typical healthy response includes:
- `ok: true`
- `hasTelemetry: true` (after Arma emits telemetry)
- `activeWorld: <worldName>`
- `appConnected` / `modConnected` (with updated bridge instance)

## Troubleshooting

### Bridge does not start
- Ensure Node is installed and available on PATH.
- Ensure port `8080` is free.
- Run in `arma-bridge/`: `npm start`

### App does not start
- In `microdagr-app/`, run: `npm run dev -- --host --port 5173 --strictPort`
- Check that port `5173` is free.

### No telemetry in app
- Confirm Arma launched with `@microdagr_bridge`.
- Check latest `.rpt` under `%LOCALAPPDATA%\Arma 3`.
- Verify bridge `/health` shows `hasTelemetry: true`.

### Map quality/source issues
- Verify PBO extractor and PAA converter availability.
- Review `Start_Bridge.bat` tool diagnostics output.

## Optional: Build Launcher EXE

Run:
- `Build_Launcher_EXE.bat`

This generates `MicroDAGR_Launcher.exe` (using `ps2exe`) and uses `microdagr-app/logo.ico` when available.

## Optional: Build Setup EXE

Run:
- `Build_Install_All_EXE.bat`

This generates `Install_All.exe` so users can run dependency setup with a single click.
