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

## ⚡ Quick Setup

| # | What | Link |
|---|------|------|
| 1 | Install **Node.js LTS** | 👉 https://nodejs.org |
| 2 | Install **ExtractPbo** (PBO extractor) | 👉 https://mikero.bytex.digital/Downloads |
| 3 | Subscribe to the **Arma 3 mod** | 👉 https://steamcommunity.com/sharedfiles/filedetails/?id=3700274411 |
| 4 | **Download this repo** | Use the green *Code → Download ZIP* button above, or `git clone` |
| 5 | Run **`Install_All.bat`** | Installs all dependencies automatically |
| 6 | Run **`Start_Launcher.bat`** → click **Start All** | Starts bridge + app |
| 7 | Launch **Arma 3** with `@microdagr_bridge` enabled | Then open the link shown in the launcher |

---

## 📖 Deep Setup Instructions

### Step 1 — Install Node.js

Download and install **Node.js LTS** from:
👉 https://nodejs.org

> Node.js is required to run the local bridge server and the companion app. Without it, nothing will start.

---

### Step 2 — Install a PBO Extractor

Download `ExtractPbo.exe` from:
👉 https://mikero.bytex.digital/Downloads

> If you've ever made Arma missions, you likely already have this.

---

### Step 3 — Subscribe to the Workshop Mod

Subscribe and enable **@microdagr_bridge** in the Arma 3 Launcher:
👉 https://steamcommunity.com/sharedfiles/filedetails/?id=3700274411

---

### Step 4 — Download This Repo (Bridge + App)

Clone or download this repository, then open the root folder and continue below.

---

### Step 5 — Run the Automatic Setup

**5.1** Run `Install_All.bat`

**5.2** Run `Start_Launcher.bat` — a launcher window should appear.

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

## 🗂️ Project Structure

| Component | Folder / File | Purpose |
|---|---|---|
| Arma addon | `@microdagr_bridge/` | SQF addon that writes telemetry to Arma `.rpt` logs |
| Telemetry bridge | `arma-bridge/` | Node.js HTTP/WebSocket server — reads `.rpt`, serves telemetry, builds map assets |
| Frontend app | `microdagr-app/` | React + Vite UI — connects to bridge WebSocket, renders map and markers |
| One-click launchers | `Start_All.bat`, `Start_Bridge.bat`, `Start_App.bat` | Start scripts for bridge and app |
| One-click setup | `Install_All.bat`, `Install_All.ps1` | Installs dependencies and checks tool prerequisites |
| GUI launcher | `MicroDAGR_Launcher.ps1`, `Start_Launcher.bat` | Desktop launcher UI with status indicators and links |
| EXE builder (optional) | `Build_Launcher_EXE.bat` | Builds `MicroDAGR_Launcher.exe` from PowerShell launcher |
| Setup EXE builder (optional) | `Build_Install_All_EXE.bat` | Builds `Install_All.exe` for single-click dependency setup |

---

## 🔧 Troubleshooting

### Bridge does not start
- Ensure **Node.js** is installed and available on PATH.
- Ensure port `8080` is free.
- Run manually in `arma-bridge/`: `npm start`

### App does not start
- Ensure port `5173` is free.
- Run manually in `microdagr-app/`: `npm run dev -- --host --port 5173 --strictPort`

### No telemetry in app
- Confirm Arma 3 launched with `@microdagr_bridge` enabled.
- Check latest `.rpt` file under `%LOCALAPPDATA%\Arma 3`.
- Verify bridge health at `http://127.0.0.1:8080/health` — look for `hasTelemetry: true`.

### Map quality issues
- Verify `ExtractPbo.exe` is installed and detected.
- Review the tool diagnostics printed by `Start_Bridge.bat` on startup.
- If using a non-standard extractor binary, set `MICRODAGR_PBO_EXTRACT_CMD` with `{input}` and `{output}` placeholders.

---

## 🛠️ For Developers: Addon Packaging

If you modify any source files under `@microdagr_bridge/addons/microdagr_bridge/`, you must rebuild the PBO before testing in-game.

| | Path |
|---|---|
| **Source folder** | `@microdagr_bridge/addons/microdagr_bridge/` |
| **Output folder** | `@microdagr_bridge/addons/` |
| **Expected PBO** | `@microdagr_bridge/addons/microdagr_bridge.pbo` |

> `Start_Bridge.bat` will warn you if source files are newer than the compiled PBO.

---

## Notes

- All data is processed **locally on your PC** (LAN/local usage only, no cloud).
- ACE/CBA are not hard-required, but some telemetry features (Vector 21 rangefinder data, etc.) are only available when ACE is loaded.

---

## License

[Custom Non-Commercial Mod License (NCML)](LICENSE.txt) © 2026 ArnieP

- ✅ Free to use, modify and redistribute
- ✅ Must credit the original author (ArnieP)
- ❌ No commercial use
- ❌ Derivative works must use the same license
