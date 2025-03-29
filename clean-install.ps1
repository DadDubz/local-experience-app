# clean-install.ps1

Write-Host "🧹 Cleaning and reinstalling dependencies for frontend and backend..."

# Clean frontend
Write-Host "➡️ Cleaning frontend..."
Set-Location ./frontend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
Set-Location ..

# Clean backend
Write-Host "➡️ Cleaning backend..."
Set-Location ./backend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
Set-Location ..

Write-Host "✅ Done. All dependencies are fresh and clean!"
