# =========================================
# BACKUP AUTOMATICO - IMPERIAL LUXURY CARS
# =========================================

Write-Host "`n=== BACKUP COMPLETO DEL PROYECTO ===" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuración
$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm"
$projectPath = "C:\arquitectura-software-main\proyecto Arquitectura"
$backupBase = "C:\BACKUP_IMPERIAL_$fecha"

# Crear carpeta de backup
Write-Host "[1/6] Creando carpeta de backup..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupBase -Force | Out-Null
Write-Host "   OK Carpeta creada: $backupBase`n" -ForegroundColor Green

# Backup del código
Write-Host "[2/6] Copiando código del proyecto..." -ForegroundColor Yellow
$codeBackup = "$backupBase\proyecto"
Copy-Item -Path $projectPath -Destination $codeBackup -Recurse -Force
Write-Host "   OK Código copiado ($((Get-ChildItem $codeBackup -Recurse | Measure-Object).Count) archivos)`n" -ForegroundColor Green

# Backup de la base de datos (si Docker está corriendo)
Write-Host "[3/6] Exportando base de datos MongoDB..." -ForegroundColor Yellow
try {
    $dbRunning = docker ps --filter "name=imperial-mongodb" --format "{{.Names}}"
    if ($dbRunning) {
        docker exec imperial-mongodb mongodump --out=/tmp/backup 2>&1 | Out-Null
        docker cp imperial-mongodb:/tmp/backup "$backupBase\database" 2>&1 | Out-Null
        Write-Host "   OK Base de datos exportada`n" -ForegroundColor Green
    } else {
        Write-Host "   ! MongoDB no está corriendo (skip)`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ! No se pudo exportar DB (skip)`n" -ForegroundColor Yellow
}

# Guardar configuración
Write-Host "[4/6] Guardando configuración..." -ForegroundColor Yellow

# Obtener último commit
Push-Location $projectPath
$lastCommit = git log -1 --pretty=format:"%h - %s (%ci)" 2>$null
$gitRemote = git remote get-url origin 2>$null
Pop-Location

$config = @"
==============================================
IMPERIAL LUXURY CARS - CONFIGURACIÓN
==============================================
Fecha de backup: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

REPOSITORIO GIT:
- URL: $gitRemote
- Último commit: $lastCommit

USUARIOS DEL SISTEMA:
- Admin Email: admin@imperialluxury.com
- Admin Password: Admin123!
- User Email: user@example.com
- User Password: User123!

PUERTOS:
- Backend API: 5000
- Frontend Web: 8080
- MongoDB: 27017
- Desktop App: 9999

VERSIONES:
- Docker: $(docker --version)
- Node.js: $(node --version 2>$null)
- npm: $(npm --version 2>$null)
- Git: $(git --version)

CONTENEDORES DOCKER:
$(docker ps --format "- {{.Names}} ({{.Status}})" 2>$null)

ARCHIVOS IMPORTANTES:
- Backend: backend/server.js
- Frontend: public/index.html
- Desktop: bin-desktop/ImperialLuxuryCars.exe
- Docker: docker-compose.yml
- Env: backend/.env (⚠️ Contiene secrets)

CLOUDINARY (Opcional):
- Cloud Name: [Revisar backend/.env]
- API Key: [Revisar backend/.env]
- API Secret: [Revisar backend/.env]

DOCUMENTACIÓN:
- Presentación: docs/PRESENTACION_PROYECTO.md
- Deployment: docs/DEPLOY_COMPLETO.md
- API Tests: docs/PRUEBAS_API.md
- Marketplace: docs/MARKETPLACE_COMPLETO.md
- Inicio: INICIAR_SISTEMA.md
- Migración: MIGRACION_DISCO.md

PARA RESTAURAR EN DISCO NUEVO:
1. Instalar: Git, Node.js, Docker Desktop, .NET 6.0 Runtime
2. Clonar repo: git clone $gitRemote
3. Copiar proyecto desde: $backupBase
4. Restaurar DB: docker cp database imperial-mongodb:/tmp/
5. Ejecutar: docker-compose up -d
6. Verificar: .\test-api.ps1

==============================================
NOTAS ADICIONALES:
- Total de archivos respaldados: $((Get-ChildItem $backupBase -Recurse | Measure-Object).Count)
- Tamaño total: $([math]::Round((Get-ChildItem $backupBase -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)) MB

==============================================
"@

$config | Out-File -FilePath "$backupBase\CONFIG_COMPLETO.txt" -Encoding UTF8
Write-Host "   OK Configuración guardada`n" -ForegroundColor Green

# Crear script rápido de restauración
Write-Host "[5/6] Creando script de restauración..." -ForegroundColor Yellow
$restoreScript = @"
# SCRIPT DE RESTAURACION RAPIDA
# Ejecutar en el disco nuevo después de instalar Git, Node.js, Docker

`$projectDest = "C:\arquitectura-software-main\proyecto Arquitectura"

Write-Host "Restaurando proyecto..." -ForegroundColor Cyan

# Copiar proyecto
Copy-Item -Path "$backupBase\proyecto" -Destination `$projectDest -Recurse -Force

# Ir a la carpeta
cd `$projectDest

# Instalar dependencias
cd backend
npm install

# Volver a raíz
cd ..

# Iniciar Docker
docker-compose up -d

Write-Host "Esperando a que Docker inicie (30 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Restaurar base de datos (si existe)
if (Test-Path "$backupBase\database") {
    docker cp "$backupBase\database" imperial-mongodb:/tmp/backup
    docker exec imperial-mongodb mongorestore /tmp/backup
    Write-Host "Base de datos restaurada" -ForegroundColor Green
}

# Probar
Write-Host "`nProbando sistema..." -ForegroundColor Cyan
.\test-api.ps1

Write-Host "`n¡Restauración completa!" -ForegroundColor Green
"@

$restoreScript | Out-File -FilePath "$backupBase\RESTAURAR.ps1" -Encoding UTF8
Write-Host "   OK Script de restauración creado`n" -ForegroundColor Green

# Crear README del backup
Write-Host "[6/6] Creando instrucciones..." -ForegroundColor Yellow
$readme = @"
# BACKUP DE IMPERIAL LUXURY CARS
Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## CONTENIDO DE ESTE BACKUP:
- proyecto/         → Código completo del proyecto
- database/         → Base de datos MongoDB exportada
- CONFIG_COMPLETO.txt → Credenciales y configuración
- RESTAURAR.ps1     → Script automático de restauración
- README.txt        → Este archivo

## COMO RESTAURAR EN DISCO NUEVO:

### PASO 1: Instalar Software Base
1. Git: https://git-scm.com/download/win
2. Node.js: https://nodejs.org/
3. Docker Desktop: https://www.docker.com/products/docker-desktop
4. .NET 6.0 Runtime: https://dotnet.microsoft.com/download/dotnet/6.0

### PASO 2: Ejecutar Restauración Automática
1. Copiar esta carpeta completa al disco nuevo
2. Abrir PowerShell como Administrador
3. Ejecutar: cd "$backupBase"
4. Ejecutar: .\RESTAURAR.ps1

### PASO 3: Verificar
- Navegar a: C:\arquitectura-software-main\proyecto Arquitectura
- Ejecutar: .\test-api.ps1
- Abrir navegador: http://localhost:8080

## MANUAL COMPLETO:
Ver archivo: proyecto/MIGRACION_DISCO.md

## CREDENCIALES:
Ver archivo: CONFIG_COMPLETO.txt

----------------------------------------
Backup creado el: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Tamaño total: $([math]::Round((Get-ChildItem $backupBase -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)) MB
Archivos: $((Get-ChildItem $backupBase -Recurse | Measure-Object).Count)
----------------------------------------
"@

$readme | Out-File -FilePath "$backupBase\README.txt" -Encoding UTF8
Write-Host "   OK Instrucciones creadas`n" -ForegroundColor Green

# Resumen final
Write-Host "`n=======================================" -ForegroundColor Green
Write-Host "       BACKUP COMPLETADO" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "`nUbicación:" -ForegroundColor Cyan
Write-Host "  $backupBase" -ForegroundColor White
Write-Host "`nContenido:" -ForegroundColor Cyan
Write-Host "  - Código del proyecto ($(((Get-ChildItem "$backupBase\proyecto" -Recurse | Measure-Object).Count)) archivos)" -ForegroundColor White
if (Test-Path "$backupBase\database") {
    Write-Host "  - Base de datos MongoDB" -ForegroundColor White
}
Write-Host "  - Configuración completa" -ForegroundColor White
Write-Host "  - Script de restauración automática" -ForegroundColor White
Write-Host "  - Instrucciones detalladas" -ForegroundColor White
Write-Host "`nTamaño total:" -ForegroundColor Cyan
Write-Host "  $([math]::Round((Get-ChildItem $backupBase -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)) MB" -ForegroundColor White

Write-Host "`n¿Qué hacer ahora?" -ForegroundColor Yellow
Write-Host "  1. Copia esta carpeta a USB o disco externo" -ForegroundColor White
Write-Host "  2. También está en GitHub: $gitRemote" -ForegroundColor White
Write-Host "  3. Para restaurar: Lee README.txt o ejecuta RESTAURAR.ps1" -ForegroundColor White

Write-Host "`n=======================================" -ForegroundColor Green
Write-Host "Presiona cualquier tecla para abrir la carpeta de backup..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "explorer.exe" -ArgumentList $backupBase
