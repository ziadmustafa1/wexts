# wexts Demo Launcher
# This script fixes the PATH temporarily and starts the demo

# Ensure we are in the script's directory
$ScriptRoot = $PSScriptRoot
if (-not $ScriptRoot) {
    $ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
}
Set-Location $ScriptRoot

Write-Host "Starting wexts Demo Environment..." -ForegroundColor Cyan
Write-Host "Working Directory: $ScriptRoot" -ForegroundColor Gray

# 1. Add Node.js to PATH (Temporary for this session)
$NodePath = "C:\Program Files\nodejs"
if (Test-Path $NodePath) {
    $env:Path = "$NodePath;$env:Path"
    Write-Host "Added Node.js to PATH" -ForegroundColor Green
}
else {
    Write-Host "Could not find Node.js at $NodePath" -ForegroundColor Red
    exit 1
}

# 2. Verify npm
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Found npm version: $(npm -v)" -ForegroundColor Green
}
else {
    Write-Host "npm not found even after PATH fix." -ForegroundColor Red
    exit 1
}

# Kill existing node processes on ports 3000, 3001, 5050
$ports = 3000, 3001, 5050
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Write-Host "Killing process $process on port $port"
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    }
}

# 3. Build Core Package
Write-Host "Checking Core Package..." -ForegroundColor Cyan
$PackageDir = Join-Path $ScriptRoot "../packages/fusionjs"

if (Test-Path $PackageDir) {
    Set-Location $PackageDir
    if (-not (Test-Path "dist")) {
        Write-Host "Building wexts package..." -ForegroundColor Yellow
        npm install
        npm run build
    }
    else {
        Write-Host "Package already built." -ForegroundColor Gray
    }
}
else {
    Write-Host "Could not find package directory at $PackageDir" -ForegroundColor Red
    exit 1
}

# 4. Install & Run Demo
Set-Location $ScriptRoot
Write-Host "Starting Demo..." -ForegroundColor Cyan
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Starting Servers..." -ForegroundColor Green
npm run dev
