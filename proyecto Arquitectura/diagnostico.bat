@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════
echo   🔍 DIAGNÓSTICO RED LOCAL
echo ═══════════════════════════════════════════════
echo.

echo [1] Obteniendo IPs de red...
echo.
ipconfig | findstr /C:"IPv4"
echo.

echo ═══════════════════════════════════════════════
echo [2] Verificando puertos abiertos...
echo.
netstat -ano | findstr ":8080" | findstr "LISTENING"
netstat -ano | findstr ":5000" | findstr "LISTENING"
echo.

echo ═══════════════════════════════════════════════
echo [3] Verificando Docker...
echo.
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo ═══════════════════════════════════════════════
echo [4] Verificando Firewall...
echo.
netsh advfirewall show allprofiles state
echo.

echo ═══════════════════════════════════════════════
echo [5] Test de conectividad local...
echo.
echo Probando localhost:8080...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8080 2>nul
echo.
echo Probando localhost:5000...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:5000 2>nul
echo.

echo ═══════════════════════════════════════════════
echo   📋 INSTRUCCIONES PARA CELULAR
echo ═══════════════════════════════════════════════
echo.
echo IMPORTANTE: Usa la IP que empieza con 192.168.x.x
echo (NO uses 127.0.0.1 ni ninguna que diga "VirtualBox" o "WSL")
echo.
echo En tu celular:
echo 1. Conecta al MISMO WiFi que esta PC
echo 2. Abre navegador
echo 3. Prueba estas URLs (usa tu IP real):
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    for /f "tokens=*" %%b in ("%%a") do (
        echo    http://%%b:8080
    )
)
echo.
echo ═══════════════════════════════════════════════
echo   🔧 SOLUCIONES SI NO FUNCIONA
echo ═══════════════════════════════════════════════
echo.
echo A. REINICIAR DOCKER + RED
echo    1. docker compose down
echo    2. Reinicia Docker Desktop
echo    3. docker compose up -d
echo.
echo B. DESACTIVAR FIREWALL TEMPORALMENTE
echo    1. Win + R → firewall.cpl
echo    2. Desactivar firewall (red privada)
echo    3. Prueba desde celular
echo    4. Vuelve a activar firewall
echo.
echo C. USAR PORTPROXY (WSL2 fix)
echo    Ejecuta como ADMINISTRADOR:
echo    netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=127.0.0.1
echo    netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=127.0.0.1
echo.
echo D. VERIFICAR WIFI
echo    - PC y celular en MISMO WiFi
echo    - NO usar "WiFi invitado" o red separada
echo    - Desactivar VPN si está activa
echo.
echo ═══════════════════════════════════════════════
echo.
pause
