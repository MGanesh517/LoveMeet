Write-Host "Starting LoveMeet Backend Server..." -ForegroundColor Green
Set-Location backend
Write-Host ""
Write-Host "Installing dependencies if needed..." -ForegroundColor Yellow
npm install
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
npm run dev

