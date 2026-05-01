@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Arma Bridge Server

set "PF=%ProgramFiles%"
set "PF86=%ProgramFiles(x86)%"
set "LAP=%LocalAppData%"

:: Ensure common Node install folders are available on PATH.
set "PATH=%PATH%;!PF!\nodejs\;!PF86!\nodejs\;!LAP!\Programs\nodejs\"

echo ==============================================
echo Starting MicroDAGR Telemetry Bridge (Arma 3)
echo ==============================================

set "SCRIPT_ROOT=%~dp0"
if not defined MICRODAGR_SKIP_ADDON_SYNC_CHECK (
	call :CheckAddonSync
)

set "NODE_EXE="
for /f "delims=" %%N in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%~fN"

if not defined NODE_EXE (
	call :DetectNode
)

if not defined NODE_EXE (
	echo [ERROR] Node.js was not found. Install Node LTS and run Start_Bridge.bat again.
	goto :end
)

for %%H in ("!NODE_EXE!") do set "NODE_EXE_DIR=%%~dpH"
set "PATH=%PATH%;!NODE_EXE_DIR!"

cd /d "%~dp0arma-bridge"

for /f "delims=" %%P in ('powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue ^| Select-Object -First 1 -ExpandProperty OwningProcess)"') do set "BRIDGE_PID=%%P"
if defined BRIDGE_PID (
	echo [WARN] Port 8080 is in use by PID !BRIDGE_PID!. Closing previous instance...
	taskkill /PID !BRIDGE_PID! /F >nul 2>nul
	set "BRIDGE_PID="
)

if not defined MICRODAGR_MAP_STYLE set "MICRODAGR_MAP_STYLE=topographic"
if not defined MICRODAGR_MAP_MAX_DIMENSION set "MICRODAGR_MAP_MAX_DIMENSION=4096"
set "MICRODAGR_ATLAS_ENABLED=0"
set "MICRODAGR_ATLAS_FORCE=0"
set "MICRODAGR_FORCE_PBO_ONLY=1"
if not defined MICRODAGR_ATLAS_ZOOM set "MICRODAGR_ATLAS_ZOOM=6"
if not defined MICRODAGR_ATLAS_CONCURRENCY set "MICRODAGR_ATLAS_CONCURRENCY=12"
if not defined MICRODAGR_PREFER_NATIVE_MAPS set "MICRODAGR_PREFER_NATIVE_MAPS=1"
if not defined MICRODAGR_STRICT_TOPO set "MICRODAGR_STRICT_TOPO=1"
if not defined MICRODAGR_MAP_REBUILD_ON_START set "MICRODAGR_MAP_REBUILD_ON_START=0"
if not defined MICRODAGR_MAX_RPT_JSON_BYTES set "MICRODAGR_MAX_RPT_JSON_BYTES=32768"
if not defined MICRODAGR_MAX_WS_FRAME_BYTES set "MICRODAGR_MAX_WS_FRAME_BYTES=24576"
if not defined MICRODAGR_MAX_MARKER_CHUNK_ITEMS set "MICRODAGR_MAX_MARKER_CHUNK_ITEMS=24"
if not defined MICRODAGR_MAX_MARKER_POINTS set "MICRODAGR_MAX_MARKER_POINTS=12"
if not defined MICRODAGR_MAP_EXTRACT_TIMEOUT_MS set "MICRODAGR_MAP_EXTRACT_TIMEOUT_MS=900000"
if not defined MICRODAGR_MAP_EXTRACT_STALL_TIMEOUT_MS set "MICRODAGR_MAP_EXTRACT_STALL_TIMEOUT_MS=180000"
set "MICRODAGR_BACKGROUND_TOPO_REFRESH=0"
if not defined MICRODAGR_BACKGROUND_TOPO_REFRESH_MS set "MICRODAGR_BACKGROUND_TOPO_REFRESH_MS=15000"
set "MICRODAGR_PBO_LAYERS_ENABLED=1"
set "MICRODAGR_PREFER_PBO_LAYERS=1"
set "MICRODAGR_PBO_LAYERS_MIN_TILES=16"
set "MICRODAGR_PBO_LAYERS_TILE_MAX_DIMENSION=168"
set "MICRODAGR_PBO_LAYERS_CONCURRENCY=2"
set "MICRODAGR_PBO_LAYERS_MAX_PBOS=24"
set "MICRODAGR_PBO_LAYERS_MAX_TIME_MS=120000"
set "MICRODAGR_PBO_EXTRACT_TIMEOUT_MS=120000"
set "MICRODAGR_HIGH_RES_REBUILD_ON_CACHE=1"

:: Universal extractor command (enabled by default).
if not defined MICRODAGR_MAP_EXTRACT_CMD (
	set "MICRODAGR_MAP_EXTRACT_CMD=node map-extractor.js --world {world} --out "{outDir}" --arma "{armaDir}" --style "!MICRODAGR_MAP_STYLE!" --rpt "{rpt}""
)

:: Auto-detect PBO extractor if not already configured.
if not defined MICRODAGR_PBO_EXTRACT_CMD (
	call :DetectPboTool
	if defined PBO_TOOL (
		set "MICRODAGR_PBO_EXTRACT_CMD="!PBO_TOOL!" -P "{input}" "{output}""
		echo [AutoDetect] PBO extractor: !PBO_TOOL!
	) else (
		echo [AutoDetect] PBO extractor was not found. Some mod textures may remain as placeholders.
	)
)

:: Auto-detect PAA converter if not already configured.
if not defined MICRODAGR_PAA_CONVERT_CMD (
	call :DetectPaaTool
	if defined PAA_TOOL (
		set "MICRODAGR_PAA_CONVERT_CMD="!PAA_TOOL!" "{input}" "{output}""
		echo [AutoDetect] PAA converter: !PAA_TOOL!
	) else (
		set "MICRODAGR_PAA_CONVERT_CMD="!NODE_EXE!" .\paa-to-png.mjs --input "{input}" --output "{output}" --max-dimension !MICRODAGR_MAP_MAX_DIMENSION!"
		echo [AutoDetect] External PAA converter was not found. Using internal Node converter: paa-to-png.mjs
	)
)

echo.
echo Running tool diagnostics (PBO/PAA)...
"!NODE_EXE!" .\tool-check.js
echo.

echo Connecting to RPT reader...
where npm >nul 2>nul
if errorlevel 1 (
	echo [WARN] npm was not found on PATH. Starting bridge directly with Node.
	"!NODE_EXE!" .\server.js
) else (
	npm start
)

:end
pause
endlocal
goto :eof

:CheckAddonSync
set "ADDON_SRC=%SCRIPT_ROOT%@microdagr_bridge\addons\microdagr_bridge"
set "ADDON_PBO=%SCRIPT_ROOT%@microdagr_bridge\addons\microdagr_bridge.pbo"

if not exist "!ADDON_SRC!\init.sqf" exit /b 0

if not exist "!ADDON_PBO!" (
	echo [WARN] !ADDON_PBO! was not found.
	echo [WARN] Arma may not load the current bridge version.
	echo.
	exit /b 0
)

set "SYNC_STATE=UNKNOWN"
for /f "delims=" %%S in ('powershell -NoProfile -Command "$pbo=$env:ADDON_PBO; $src=$env:ADDON_SRC; if (!(Test-Path -LiteralPath $pbo) -or !(Test-Path -LiteralPath $src)) { 'UNKNOWN'; exit 0 }; $pboTime=(Get-Item -LiteralPath $pbo).LastWriteTimeUtc; $latestSrc=(Get-ChildItem -LiteralPath $src -File -Recurse | Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 1); if ($null -eq $latestSrc) { 'UNKNOWN'; exit 0 }; if ($latestSrc.LastWriteTimeUtc -gt $pboTime) { 'STALE' } else { 'OK' }"') do set "SYNC_STATE=%%S"

if /I "!SYNC_STATE!"=="STALE" (
	echo [WARN] microdagr_bridge.pbo appears OUTDATED compared with the source code.
	echo [WARN] Repack ".\@microdagr_bridge\addons\microdagr_bridge" into ".\@microdagr_bridge\addons\microdagr_bridge.pbo"
	echo [WARN] otherwise Arma will keep running old scripts.
	echo.
)
exit /b 0

:DetectNode
set "NODE_EXE="
for %%F in (
	"!PF!\nodejs\node.exe"
	"!PF86!\nodejs\node.exe"
	"!LAP!\Programs\nodejs\node.exe"
) do (
	if not defined NODE_EXE if exist "%%~fF" set "NODE_EXE=%%~fF"
)
if not defined NODE_EXE (
	for /f "delims=" %%G in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%~fG"
)
exit /b 0

:DetectPboTool
set "PBO_TOOL="
for %%F in (
	"!PF86!\Mikero\DePboTools\bin\ExtractPbo.exe"
	"!PF!\Mikero\DePboTools\bin\ExtractPbo.exe"
	"!PF86!\Steam\steamapps\common\Arma 3 Tools\ExtractPbo\ExtractPbo.exe"
	"!PF!\Steam\steamapps\common\Arma 3 Tools\ExtractPbo\ExtractPbo.exe"
) do (
	if not defined PBO_TOOL if exist "%%~fF" set "PBO_TOOL=%%~fF"
)
if not defined PBO_TOOL (
	for /f "delims=" %%G in ('where extractpbo.exe 2^>nul') do if not defined PBO_TOOL set "PBO_TOOL=%%~fG"
)
exit /b 0

:DetectPaaTool
set "PAA_TOOL="
for %%F in (
	"!PF86!\Mikero\DePboTools\bin\PaaToPng.exe"
	"!PF!\Mikero\DePboTools\bin\PaaToPng.exe"
	"!PF86!\Mikero\DePboTools\bin\paa2img.exe"
	"!PF!\Mikero\DePboTools\bin\paa2img.exe"
	"!PF86!\Mikero\DePboTools\bin\paa2png.exe"
	"!PF!\Mikero\DePboTools\bin\paa2png.exe"
) do (
	if not defined PAA_TOOL if exist "%%~fF" set "PAA_TOOL=%%~fF"
)
if not defined PAA_TOOL (
	for /f "delims=" %%G in ('where paatopng.exe 2^>nul') do if not defined PAA_TOOL set "PAA_TOOL=%%~fG"
)
if not defined PAA_TOOL (
	for /f "delims=" %%G in ('where paa2img.exe 2^>nul') do if not defined PAA_TOOL set "PAA_TOOL=%%~fG"
)
if not defined PAA_TOOL (
	for /f "delims=" %%G in ('where paa2png.exe 2^>nul') do if not defined PAA_TOOL set "PAA_TOOL=%%~fG"
)
exit /b 0
