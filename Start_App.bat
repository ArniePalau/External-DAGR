@echo off
title MicroDAGR Mobile App Demo

:: Ens assegurem que el PATH tingui Node
set "PATH=%PATH%;%ProgramFiles%\nodejs\;%SystemDrive%\Program Files\nodejs\"

echo ==============================================
echo Iniciant Servidor Web i obrint el Navegador...
echo ==============================================
cd "microdagr-app"

:: Inicia el servidor i obre la finestra
npm run dev -- --host --port 5173 --strictPort

pause
