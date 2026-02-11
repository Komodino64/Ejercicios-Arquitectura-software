# 🖥️ ACTUALIZAR Y EJECUTAR APP DE ESCRITORIO

Write-Host "`n=== 🖥️ IMPERIAL LUXURY CARS - APP ESCRITORIO ===" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# 1. Verificar que backend esté corriendo
Write-Host "[1/4] Verificando backend..." -ForegroundColor Yellow
try {
    $backend = Invoke-RestMethod -Uri "http://localhost:5000/" -TimeoutSec 2
    Write-Host "✅ Backend activo en puerto 5000`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend NO está corriendo" -ForegroundColor Red
    Write-Host "`n   Inicia Docker primero:" -ForegroundColor Yellow
    Write-Host "   docker compose up -d`n" -ForegroundColor Gray
    exit 1
}

# 2. Sincronizar archivos public → wwwroot
Write-Host "[2/4] Sincronizando archivos..." -ForegroundColor Yellow

$publicPath = ".\public"
$wwwrootPath = ".\bin-desktop\wwwroot"

if (-not (Test-Path $publicPath)) {
    Write-Host "❌ Carpeta public\ no encontrada`n" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $wwwrootPath)) {
    Write-Host "❌ Carpeta bin-desktop\wwwroot\ no encontrada" -ForegroundColor Red
    Write-Host "   El .exe no está compilado correctamente`n" -ForegroundColor Yellow
    exit 1
}

# Copiar archivos actualizados
Write-Host "   Copiando archivos actualizados..." -ForegroundColor Gray
Copy-Item -Path "$publicPath\*" -Destination $wwwrootPath -Recurse -Force

Write-Host "✅ Archivos sincronizados (public → wwwroot)`n" -ForegroundColor Green

# 3. Verificar ejecutable
Write-Host "[3/4] Verificando ejecutable..." -ForegroundColor Yellow
$exePath = ".\bin-desktop\ImperialLuxuryCars.exe"

if (-not (Test-Path $exePath)) {
    Write-Host "❌ ImperialLuxuryCars.exe no encontrado`n" -ForegroundColor Red
    exit 1
}

$exeSize = (Get-Item $exePath).Length / 1MB
Write-Host "✅ Ejecutable encontrado ($([math]::Round($exeSize, 2)) MB)`n" -ForegroundColor Green

# 4. Ejecutar aplicación
Write-Host "[4/4] Iniciando aplicación..." -ForegroundColor Yellow
Write-Host "`n   🚀 Abriendo ImperialLuxuryCars.exe...`n" -ForegroundColor Cyan

try {
    Start-Process -FilePath $exePath
    Write-Host "✅ Aplicación iniciada" -ForegroundColor Green
    Write-Host "`n   La app se abrirá en localhost:9999" -ForegroundColor Gray
    Write-Host "   Backend: localhost:5000`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error al iniciar: $($_.Exception.Message)`n" -ForegroundColor Red
}

Write-Host "=== ✅ COMPLETADO ===" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green
