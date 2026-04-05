@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command "if (-not (Get-Module -ListAvailable -Name ps2exe)) { Install-Module ps2exe -Scope CurrentUser -Force -AllowClobber }; $iconPath = Join-Path (Get-Location) 'microdagr-app\logo.ico'; if (Test-Path -LiteralPath $iconPath) { Invoke-PS2EXE -InputFile '.\Install_All.ps1' -OutputFile '.\Install_All.exe' -NoConsole -Title 'External DAGR Setup' -Product 'External DAGR Setup' -Company 'External DAGR' -IconFile $iconPath } else { Invoke-PS2EXE -InputFile '.\Install_All.ps1' -OutputFile '.\Install_All.exe' -NoConsole -Title 'External DAGR Setup' -Product 'External DAGR Setup' -Company 'External DAGR' }"

if errorlevel 1 (
  echo [ERROR] Could not build Install_All.exe
  pause
  endlocal
  exit /b 1
)

echo [OK] EXE created: %~dp0Install_All.exe
pause
endlocal
