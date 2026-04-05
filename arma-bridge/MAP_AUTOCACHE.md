# MicroDAGR Bridge - Auto Map Cache

This bridge can auto-provide world maps without shipping Arma assets in your app package.

## How it works

1. SQF telemetry sends `worldName` and `worldSize`.
2. Bridge receives telemetry and resolves a normalized world key (for example `Altis` -> `altis`).
3. Bridge checks `%LOCALAPPDATA%\\MicroDAGRBridge\\maps` for an existing file:
   - `altis.jpg`, `altis.png`, `altis.webp`, `altis.svg`, etc.
4. If not found, bridge attempts map provisioning:
   - Copy from `MICRODAGR_MAP_SOURCE_DIR`
   - Copy from local `./maps` folder in the bridge working directory
   - Run extractor command if configured (default startup uses `map-extractor.js`)
5. If all strategies fail, bridge generates an SVG placeholder map.

## HTTP endpoints

- `GET /health`
- `GET /api/map/current`
- `GET /api/map/<worldKey>`
- `GET /api/map/rebuild/<worldKey>`
- `GET /maps/<fileName>`

## Environment variables

- `MICRODAGR_BRIDGE_PORT` (default `8080`)
- `MICRODAGR_MAP_SOURCE_DIR` (folder containing exported map files)
- `MICRODAGR_MAP_EXTRACT_CMD` (optional external command)
- `MICRODAGR_PBO_EXTRACT_CMD` (optional PBO extraction command used by `map-extractor.js`)
- `MICRODAGR_PAA_CONVERT_CMD` (optional PAA to image converter command used by `map-extractor.js`)

`Start_Bridge.bat` now auto-detects common install paths for Node, PBO extractors and PAA converters.
If detection fails, you can still set these variables manually.

On each startup, `Start_Bridge.bat` runs `tool-check.js` and prints:

- Detected Node binary/version
- Active map extractor command
- PBO extractor status
- PAA converter status
- Readiness level (`FULL`, `PARTIAL`, `LIMITED`)

Extractor command placeholders:

- `{world}` -> normalized world key (`altis`, `stratis`, ...)
- `{worldName}` -> raw world name from telemetry
- `{outDir}` -> map cache folder path
- `{cacheDir}` -> map cache folder path
- `{armaDir}` -> detected Arma 3 folder
- `{rpt}` -> current tailed RPT path

Example:

`MICRODAGR_MAP_EXTRACT_CMD="node map-extractor.js --world {world} --out \"{outDir}\" --arma \"{armaDir}\" --rpt \"{rpt}\""`

## Universal extractor behavior

The included `map-extractor.js` is generic and works for unknown maps with this strategy:

1. Detect Arma install and addon directories (vanilla + local mods).
2. Search unpacked addon folders for matching map images.
3. If not found, search matching world PBO files and try extracting them.
4. Pick best candidate image (sat/map/overview weighted).
5. Convert/copy into bridge cache as `<worldKey>.<ext>`.

To support many modded terrains in practice, configure:

- `MICRODAGR_PBO_EXTRACT_CMD` with your PBO extractor
- `MICRODAGR_PAA_CONVERT_CMD` with your PAA converter

Built-in fallback now included:

- If no external PAA converter is found, `Start_Bridge.bat` auto-uses `paa-to-png.mjs`.
- This converter uses npm dependencies already installed in `arma-bridge`.

Without these tools, the bridge still works but can fallback to SVG placeholder for worlds whose textures are only inside PBO/PAA.

If a world is already cached as placeholder and you later install tools, force refresh with:

`GET /api/map/rebuild/<worldKey>`

## Publishing notes

Use local extraction + local cache. Do not bundle Arma map assets in your distributed app.
Require users to own/install Arma 3 and produce assets locally.
