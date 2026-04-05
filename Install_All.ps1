$ErrorActionPreference = 'Stop'

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mikeroUrl = 'https://mikero.bytex.digital/Downloads'
$nodeUrl = 'https://nodejs.org/en/download'

function Write-Step {
    param([string]$Message)
    Write-Host "[Setup] $Message" -ForegroundColor Cyan
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[Setup] $Message" -ForegroundColor Yellow
}

function Write-Ok {
    param([string]$Message)
    Write-Host "[Setup] $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[Setup] $Message" -ForegroundColor Red
}

function Test-CommandAvailable {
    param([string]$Name)
    try {
        $null = Get-Command $Name -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Find-ExtractPbo {
    $pf = ${env:ProgramFiles}
    $pf86 = ${env:ProgramFiles(x86)}

    $candidates = @(
        "$pf86\Mikero\DePboTools\bin\ExtractPbo.exe",
        "$pf\Mikero\DePboTools\bin\ExtractPbo.exe",
        "$pf86\Steam\steamapps\common\Arma 3 Tools\ExtractPbo\ExtractPbo.exe",
        "$pf\Steam\steamapps\common\Arma 3 Tools\ExtractPbo\ExtractPbo.exe",
        "$rootDir\PBO Manager\pboc.exe"
    )

    foreach ($path in $candidates) {
        if ($path -and (Test-Path -LiteralPath $path)) {
            return $path
        }
    }

    try {
        $cmd = Get-Command extractpbo.exe -ErrorAction Stop
        if ($cmd -and $cmd.Source) {
            return $cmd.Source
        }
    } catch {
        # Ignore if not found in PATH.
    }

    return $null
}

function Install-NpmDependencies {
    param(
        [string]$ProjectDir,
        [string]$DisplayName
    )

    if (-not (Test-Path -LiteralPath $ProjectDir)) {
        throw "$DisplayName folder not found: $ProjectDir"
    }

    $pkg = Join-Path $ProjectDir 'package.json'
    if (-not (Test-Path -LiteralPath $pkg)) {
        throw "$DisplayName has no package.json: $ProjectDir"
    }

    Write-Step "Installing npm dependencies for $DisplayName..."
    Push-Location $ProjectDir
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed in $DisplayName"
        }
    } finally {
        Pop-Location
    }

    Write-Ok "$DisplayName dependencies installed."
}

Write-Host "=============================================="
Write-Host " External DAGR One-Click Setup" -ForegroundColor White
Write-Host "=============================================="

if (-not (Test-CommandAvailable -Name 'node')) {
    Write-Fail 'Node.js was not found on PATH.'
    Write-Warn 'Please install Node.js (LTS), then re-run this installer.'
    Start-Process $nodeUrl | Out-Null
    exit 1
}

if (-not (Test-CommandAvailable -Name 'npm')) {
    Write-Fail 'npm was not found on PATH.'
    Write-Warn 'Please install/reinstall Node.js, then re-run this installer.'
    Start-Process $nodeUrl | Out-Null
    exit 1
}

Write-Ok "Node detected: $(node -v)"
Write-Ok "npm detected: $(npm -v)"

$extractor = Find-ExtractPbo
if ($extractor) {
    Write-Ok "PBO extractor detected: $extractor"
} else {
    Write-Warn 'No supported PBO extractor found (ExtractPbo.exe / pboc.exe).'
    Write-Warn 'Map extraction quality may be limited until an extractor is installed.'
    Write-Warn "Opening Mikero downloads: $mikeroUrl"
    Start-Process $mikeroUrl | Out-Null
}

$bridgeDir = Join-Path $rootDir 'arma-bridge'
$appDir = Join-Path $rootDir 'microdagr-app'

Install-NpmDependencies -ProjectDir $bridgeDir -DisplayName 'arma-bridge'
Install-NpmDependencies -ProjectDir $appDir -DisplayName 'microdagr-app'

Write-Host ''
Write-Ok 'Setup completed successfully.'
Write-Step 'Next step: run Start_Launcher.bat and click Start All.'
exit 0
