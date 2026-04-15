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
    Write-Host "[✗] Node.js not found. Please install Node.js 22+." -ForegroundColor Red
    exit
}

# Install CAT
Write-Host "Installing CAT CLI..." -ForegroundColor Yellow
npm install -g .

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
