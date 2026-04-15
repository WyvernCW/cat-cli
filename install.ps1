Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  /\_/\  CAT CLI Installer  v1.0.0   ║" -ForegroundColor Cyan
Write-Host "║ ( o.o )  Coding Agentic Terminal    ║" -ForegroundColor Cyan
Write-Host "║  > ^ <   Powered by Minimax M2.7    ║" -ForegroundColor Cyan
Write-Host "║ /|   |\                             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`nChecking dependencies..." -ForegroundColor Yellow

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "[✓] Node.js $(node -v) Detected" -ForegroundColor Green
} else {
    Write-Host "[!] Node.js not found. Installing Node.js 22 via winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    if (-not $?) {
        Write-Host "[✗] Node.js installation failed. Please install manually." -ForegroundColor Red
        exit
    }
    Write-Host "[✓] Node.js installed." -ForegroundColor Green
}

# Check for Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "[✓] Git Detected" -ForegroundColor Green
} else {
    Write-Host "[!] Git not found. Installing Git via winget..." -ForegroundColor Yellow
    winget install Git.Git --silent --accept-package-agreements --accept-source-agreements
    if (-not $?) {
        Write-Host "[✗] Git installation failed. Please install manually." -ForegroundColor Red
        exit
    }
    Write-Host "[✓] Git installed." -ForegroundColor Green
}

# Install CAT
Write-Host "`nInstalling CAT CLI..." -ForegroundColor Yellow

$tempDir = Join-Path $env:TEMP "cat-cli-install"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }

Write-Host "Cloning repository..." -ForegroundColor Gray
git clone https://github.com/WyverncW/cat-cli.git $tempDir --quiet

Push-Location $tempDir

Write-Host "Installing dependencies..." -ForegroundColor Gray
npm install --quiet --no-warnings --no-audit --no-fund --loglevel error
Write-Host "Building CAT..." -ForegroundColor Gray
npm run build --quiet

Write-Host "Installing globally..." -ForegroundColor Gray
# Use a predictable pack filename by setting version explicitly or just using glob
npm pack --quiet --no-warnings --loglevel error
$packFile = Get-ChildItem "cat-cli-*.tgz" | Select-Object -First 1 -ExpandProperty Name
npm install -g "$tempDir\$packFile" --quiet --no-warnings --no-audit --no-fund --loglevel error

Pop-Location
Remove-Item -Recurse -Force $tempDir

Write-Host "`n╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓  CAT CLI installed successfully!                  ║" -ForegroundColor Green
Write-Host "║                                                      ║" -ForegroundColor Green
Write-Host "║  Get started:                                        ║" -ForegroundColor Green
Write-Host "║    cat-ai              → Start Cat                   ║" -ForegroundColor Green
Write-Host "║    cat-ai config       → Set up your API key         ║" -ForegroundColor Green
Write-Host "║                                                      ║" -ForegroundColor Green
Write-Host "║     /\_/\  Happy coding!                             ║" -ForegroundColor Green
Write-Host "║    ( ^.^ )                                           ║" -ForegroundColor Green
Write-Host "║     > ^ <                                            ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
