# Runs O Pescador locally on Windows at http://localhost:8080.
#
#   .\run-local.cmd              (double-click, or from a terminal)
#   .\run-local.cmd -NoBrowser   (don't open the browser)
#
# Stop the server with Ctrl+C. The local database is in memory, so accounts,
# spots and images reset every time the server stops; the first account created
# after a start becomes the admin.
param([switch]$NoBrowser)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
# Sign-in only trusts port 8080 locally (see src/lib/auth/server.ts), so the port is fixed.
$port = 8080
$url = "http://localhost:$port"
# Probe IPv4 directly: Windows PowerShell tries ::1 for "localhost" first and times out.
$probe = "http://127.0.0.1:$port/peixe.html"

function Say($text, $color = "Cyan") { Write-Host "[O Pescador] $text" -ForegroundColor $color }

function Test-App {
  try {
    $r = Invoke-WebRequest $probe -UseBasicParsing -TimeoutSec 2
    return $r.StatusCode -eq 200
  } catch {
    return $false
  }
}

# 1. Node.js (22 or newer)
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  $nodeDir = Join-Path $env:ProgramFiles "nodejs"
  if (Test-Path (Join-Path $nodeDir "node.exe")) {
    $env:Path = "$nodeDir;$env:Path"
  } else {
    Say "Node.js not found. Install Node 22 or newer from https://nodejs.org and run this again." Red
    exit 1
  }
}
$nodeVersion = (node -v).Trim()
$major = [int]($nodeVersion.TrimStart("v").Split(".")[0])
if ($major -lt 22) {
  Say "Node $nodeVersion is too old; this app needs Node 22 or newer (https://nodejs.org)." Red
  exit 1
}
Say "Using Node $nodeVersion"

# 2. Already running? Just open it.
if (Test-App) {
  Say "The app is already running at $url" Green
  if (-not $NoBrowser) { Start-Process $url }
  exit 0
}
$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  $owner = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
  Say "Port $port is used by another program ($($owner.ProcessName), PID $($listener.OwningProcess)). Close it and try again." Red
  exit 1
}

# 3. Dependencies: install when missing or when package-lock.json changed since the last install.
$installedLock = Join-Path $root "node_modules\.package-lock.json"
$needsInstall = -not (Test-Path $installedLock)
if (-not $needsInstall) {
  $needsInstall = (Get-Item (Join-Path $root "package-lock.json")).LastWriteTime -gt (Get-Item $installedLock).LastWriteTime
}
if ($needsInstall) {
  Say "Installing dependencies (first run can take a few minutes)..."
  npm install
  if ($LASTEXITCODE -ne 0) {
    Say "npm install failed; see the messages above." Red
    exit 1
  }
}

# 4. Open the browser as soon as the app answers (in the background).
if (-not $NoBrowser) {
  $opener = Start-Job -ArgumentList $probe, $url -ScriptBlock {
    param($probe, $open)
    for ($i = 0; $i -lt 120; $i++) {
      try {
        Invoke-WebRequest $probe -UseBasicParsing -TimeoutSec 2 | Out-Null
        Start-Process $open
        return
      } catch {
        Start-Sleep -Seconds 1
      }
    }
  }
}

# 5. Run the dev server in this window until Ctrl+C.
Say "Starting at $url  (app: $url/peixe.html, backoffice: $url/admin). Press Ctrl+C to stop." Green
Say "Local data lives in memory and resets when the server stops." Yellow
try {
  npm run dev
} finally {
  if ($opener) { Remove-Job $opener -Force -ErrorAction SilentlyContinue }
}
