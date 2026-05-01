# MicroDAGR Mobile App - Development Guide

## 1. Overview
The main goal of this project is to create a mobile application for Android devices (APK), and later for iOS, that faithfully reproduces the **MicroDAGR** device included in the **ACE3** mod for Arma 3.

Unlike a purely visual reproduction, the app must be linked to the game in real time through live telemetry. This means that the information shown in the app, such as azimuth, coordinates, speed, and waypoints, must be extracted from the active Arma 3 character at the same moment it is displayed. The app should also be able to interact with the in-game MicroDAGR interface.

## 2. Research and Base Files
During the initial exploration, the original ACE3 MicroDAGR addon was analyzed:
- **Interface logic (`fnc_updateDisplay.sqf`)**:
  - It uses functions such as `CBA_fnc_headDir` for azimuth/heading.
  - Position is read with `getPosASL ACE_player`, then converted to MGRS format and a map-grid reference with `EFUNC(common,getMapGridFromPos)`.
  - Speed is read from `speed (vehicle ACE_player)`.
  - The waypoint system is read from an internal variable managed by the app and uses `[ACE_player] call BIS_fnc_dirTo` for distance and bearing relative to the waypoint.

## 3. Proposed Architecture
To link the app to Arma 3, the architecture is split into **3 layers**:

1. **Mod / Addon (Arma 3 Component)**
   - Create a small SQF *script/addon* that runs in the background. Its purpose is to continuously read and inject relevant variables such as position, heading, speed, and MicroDAGR route points, for example every 0.2 seconds.
   - Send and receive this information outside the game environment.

2. **Bridge Server (Local Bridge)**
   - To connect the game with an external mobile device, the data must be transported out of Arma 3.
   - A small web server on the PC acts as middleware between information provided by Arma 3, for example through an existing Arma extension or a NodeJS/C# tracker, and the mobile app over WebSocket communication on the local network (Wi-Fi).

3. **Mobile Application (Frontend)**
   - Use a modern framework (React / Vite) for agile web development, designing an interactive MicroDAGR visual replica with strong attention to animation, smoothness, and a premium appearance.
   - Use *Capacitor* to convert the web code into a mobile app and generate the APK.
   - Feed the app through WebSockets with data from the bridge server.

## 4. Developed Components and Usage Instructions

The current state and startup flow are detailed below:

### 1. Arma 3 Mod (`microdagr_bridge`)
- **Action**: Configuration files and the base script have been prepared inside this same folder at `microdagr_bridge`.
- This add-on uses `diag_log` to write telemetry information continuously to the Arma 3 `.rpt` log file, with almost invisible performance impact compared with heavier TCP libraries.
- **Packaging Instructions (Addon Builder)**: To avoid the "Script not found" error, create the `.pbo` correctly:
  1. Open Addon Builder from Arma 3 Tools.
  2. **Source Directory**: Select the innermost folder: `\@microdagr_bridge\addons\microdagr_bridge`
  3. **Destination Directory**: Select the folder immediately above it: `\@microdagr_bridge\addons`
  4. Clear the "Binarize" checkbox.
  5. Open "Options" on the right and set **Addon Prefix** to: `microdagr_bridge`
  6. Click Pack. Finish by loading the root `@microdagr_bridge` folder as a local mod in the game.

### 2. Quick Run Utilities (`.bat` Scripts)
Two files have been generated in the root folder so Node and the application can be started with a double-click, without having to run everything from the console.
- **`Start_Bridge.bat`**: Reads and watches the game RPT file in real time to capture telemetry, then serves the data on port 8080.
- **`Start_App.bat`**: Starts Vite React, compiles the dynamic interface, and opens it in your preferred browser.

### Next Steps / Future Improvements
Once the Arma system is working and validated in real time, with no JSON console errors and with azimuth or speed visible, the next recommended task is deeper extraction of the *Waypoints List* from the mission using native `ace_microdagr_fnc_...` functions. This would allow the full list to be sent, displayed, and mapped more accurately in the app as coordinates instead of mocked test messages.

## 5. Map Extraction: Topographic and Satellite
To provide real Arma 3 maps to the application, a hybrid image-processing pipeline has been implemented.

### Topographic Extraction (current state)
The current main flow uses native extraction from game files (PBO/PAA) to generate the final map consistently.
The in-game screenshot export path has been removed from the standard flow to reduce complexity and avoid inconsistencies caused by engine window focus.

### Automatic Satellite Fallback (PBO Extraction)
If in-game export fails, or if the flow should depend exclusively on Arma files on disk, `map-extractor.js` now contains a direct routine that:
1. Automatically scans Arma folders when no pre-exported tiles are found.
2. Identifies the base terrain image (`pictureMap_ca.paa`) by searching the main map PBO (`map_<world>_data.pbo`) through *PBO Manager (`pboc.exe`)*.
3. Converts it from Arma's native PAA format to PNG on demand before the app requests it (Plan A).
4. Removes residual "PBO layers" that caused unusual artifacts (`_lco.paa`), ensuring the processed product is valid cartography for navigation.
