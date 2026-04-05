@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$iconPath = Join-Path (Get-Location) 'microdagr-app\logo.ico'; if (-not (Get-Module -ListAvailable -Name ps2exe)) { Install-Module ps2exe -Scope CurrentUser -Force -AllowClobber }; if (Test-Path -LiteralPath $iconPath) { Invoke-PS2EXE -InputFile '.\MicroDAGR_Launcher.ps1' -OutputFile '.\MicroDAGR_Launcher.exe' -NoConsole -Title 'MicroDAGR Launcher' -Product 'MicroDAGR Launcher' -Company 'MicroDAGR' -IconFile $iconPath } else { Invoke-PS2EXE -InputFile '.\MicroDAGR_Launcher.ps1' -OutputFile '.\MicroDAGR_Launcher.exe' -NoConsole -Title 'MicroDAGR Launcher' -Product 'MicroDAGR Launcher' -Company 'MicroDAGR' }"

if errorlevel 1 (
  echo [ERROR] No s'ha pogut generar l'EXE.
  pause
  endlocal
  exit /b 1
)

echo [OK] EXE creat: %~dp0MicroDAGR_Launcher.exe
pause
endlocal
