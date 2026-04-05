@echo off
setlocal EnableExtensions
title MicroDAGR Unified Launcher

cd /d "%~dp0"

if not exist "%~dp0Start_Bridge.bat" (
    echo [ERROR] No s'ha trobat Start_Bridge.bat
    goto :end
)

if not exist "%~dp0Start_App.bat" (
    echo [ERROR] No s'ha trobat Start_App.bat
    goto :end
)

echo ==============================================
echo Iniciant MicroDAGR amb un sol script
echo ==============================================
echo Obrint Bridge...
start "MicroDAGR Bridge" cmd /k ""%~dp0Start_Bridge.bat""

echo Obrint App...
start "MicroDAGR App" cmd /k ""%~dp0Start_App.bat""

echo Fet. Pots tancar aquesta finestra.

:end
endlocal
