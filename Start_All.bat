@echo off
setlocal EnableExtensions
title MicroDAGR Unified Launcher

cd /d "%~dp0"

if not exist "%~dp0Start_Bridge.bat" (
    echo [ERROR] Start_Bridge.bat was not found
    goto :end
)

if not exist "%~dp0Start_App.bat" (
    echo [ERROR] Start_App.bat was not found
    goto :end
)

echo ==============================================
echo Starting MicroDAGR with a single script
echo ==============================================
echo Opening Bridge...
start "MicroDAGR Bridge" cmd /k ""%~dp0Start_Bridge.bat""

echo Opening App...
start "MicroDAGR App" cmd /k ""%~dp0Start_App.bat""

echo Done. You can close this window.

:end
endlocal
