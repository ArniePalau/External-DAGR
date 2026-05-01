@echo off
title MicroDAGR Mobile App Demo

:: Ensure PATH includes Node.
set "PATH=%PATH%;%ProgramFiles%\nodejs\;%SystemDrive%\Program Files\nodejs\"

echo ==============================================
echo Starting web server and opening the browser...
echo ==============================================
cd "microdagr-app"

:: Start the server and open the window.
npm run dev -- --host --port 5173 --strictPort

pause
