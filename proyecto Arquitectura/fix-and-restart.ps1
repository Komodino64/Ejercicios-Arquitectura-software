# Script para aplicar cambios y reiniciar Docker
Write-Host "🔧 Aplicando correcciones..." -ForegroundColor Cyan

# Renombrar config.js obsoleto
if (Test-Path "public\js\config.js") {
    Move-Item -Path "public\js\config.js" -Destination "public\js\config.js.FIREBASE_OBSOLETO" -Force
    Write-Host "✅ Archivo config.js obsoleto renombrado" -ForegroundColor Green
}

# Reiniciar Docker Compose
Write-Host "`n🐳 Reiniciando Docker..." -ForegroundColor Cyan
docker compose down
Start-Sleep -Seconds 2
docker compose up -d

Write-Host "`n✨ Esperando que los servicios inicien..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Verificar estado
docker ps --filter "name=imperial"

Write-Host "`n✅ LISTO! Prueba ahora:" -ForegroundColor Green
Write-Host "   1. http://localhost:8080/ (Catálogo)" -ForegroundColor Yellow
Write-Host "   2. http://localhost:8080/login.html (Admin)" -ForegroundColor Yellow
Write-Host "   3. Presiona F12 para ver la consola" -ForegroundColor Yellow
