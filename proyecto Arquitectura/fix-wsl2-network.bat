@echo off
:: Ejecutar como ADMINISTRADOR
echo ═══════════════════════════════════════════════
echo   🔧 FIX WSL2 - Docker Desktop Red Local
echo ═══════════════════════════════════════════════
echo.
echo Este script configura port forwarding para WSL2
echo Necesitas ejecutarlo como ADMINISTRADOR
echo.
pause

echo.
echo [1] Eliminando reglas anteriores (si existen)...
netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=0.0.0.0 2>nul
netsh interface portproxy delete v4tov4 listenport=5000 listenaddress=0.0.0.0 2>nul
netsh interface portproxy delete v4tov4 listenport=27017 listenaddress=0.0.0.0 2>nul

echo.
echo [2] Creando reglas de port forwarding...
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=27017 listenaddress=0.0.0.0 connectport=27017 connectaddress=127.0.0.1

echo.
echo [3] Creando reglas de firewall...
netsh advfirewall firewall delete rule name="Imperial Frontend WSL" 2>nul
netsh advfirewall firewall delete rule name="Imperial Backend WSL" 2>nul

netsh advfirewall firewall add rule name="Imperial Frontend WSL" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="Imperial Backend WSL" dir=in action=allow protocol=TCP localport=5000

echo.
echo [4] Verificando configuración...
echo.
netsh interface portproxy show all
echo.

echo ═══════════════════════════════════════════════
echo   ✅ CONFIGURACIÓN COMPLETADA
echo ═══════════════════════════════════════════════
echo.
echo Ahora prueba desde tu celular:
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    for /f "tokens=*" %%b in ("%%a") do (
        echo    http://%%b:8080
    )
)
echo.
echo NOTA: Si cambias de red WiFi, ejecuta este script otra vez
echo.
pause
