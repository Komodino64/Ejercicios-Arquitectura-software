@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════
echo   🌐 ACCESO RED LOCAL - Imperial Luxury Cars
echo ═══════════════════════════════════════════════
echo.

:: Obtener IP local (más confiable)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    for /f "tokens=*" %%b in ("%%a") do (
        set IP=%%b
        goto :show
    )
)

:show
echo ✅ IP LOCAL: %IP%
echo.
echo ═══════════════════════════════════════════════
echo   📱 URLs PARA ACCESO
echo ═══════════════════════════════════════════════
echo.
echo 🖥️  ESTA PC (localhost):
echo    http://localhost:8080
echo.
echo 📱 OTROS DISPOSITIVOS (misma red WiFi):
echo    http://%IP%:8080
echo.
echo ═══════════════════════════════════════════════
echo   📋 INSTRUCCIONES RÁPIDAS
echo ═══════════════════════════════════════════════
echo.
echo 1. Desde tu celular/tablet:
echo    • Conéctate al MISMO WiFi
echo    • Abre navegador
echo    • Ingresa: http://%IP%:8080
echo.
echo 2. Si NO funciona, configura firewall:
echo    • Click derecho en get-network-url.bat
echo    • "Ejecutar como administrador"
echo.
echo ═══════════════════════════════════════════════
echo.
