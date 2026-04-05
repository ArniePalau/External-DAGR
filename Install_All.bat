@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install_All.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo [ERROR] Setup failed with code %EXIT_CODE%.
  pause
  endlocal
  exit /b %EXIT_CODE%
)

echo.
echo [OK] Setup completed.
pause
endlocal
