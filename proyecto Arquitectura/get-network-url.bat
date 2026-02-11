@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════
echo   🌐 IMPERIAL LUXURY CARS - ACCESO RED LOCAL
echo ═══════════════════════════════════════════════
echo.
echo Obteniendo IP de la red local...
echo.

:: Obtener IP local (Windows)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
:: Limpiar espacios
for /f "tokens=* delims= " %%a in ("%IP%") do set IP=%%a

echo ✅ IP LOCAL DETECTADA: %IP%
echo.
echo ═══════════════════════════════════════════════
echo   📱 URLs PARA ACCESO
echo ═══════════════════════════════════════════════
echo.
echo 🖥️  LOCALHOST (esta PC):
echo    Frontend: http://localhost:8080
echo    Backend:  http://localhost:5000
echo.
echo 📱 RED LOCAL (otros dispositivos):
echo    Frontend: http://%IP%:8080
echo    Backend:  http://%IP%:5000
echo.
echo ═══════════════════════════════════════════════
echo   📋 INSTRUCCIONES
echo ═══════════════════════════════════════════════
echo.
echo 1. Asegúrate que Docker esté corriendo
echo 2. Ejecuta: docker compose up -d
echo 3. Desde OTRO dispositivo en la MISMA red WiFi:
echo    • Abre: http://%IP%:8080
echo.
echo 4. En tu celular/tablet:
echo    • Conecta al mismo WiFi
echo    • Abre navegador
echo    • Ingresa: http://%IP%:8080
echo.
echo ⚠️  FIREWALL DE WINDOWS:
echo    Si no funciona, permite los puertos 5000 y 8080:
echo    • Panel de Control ^> Firewall de Windows
echo    • Reglas de entrada ^> Nueva regla
echo    • Puerto: 5000 y 8080 (TCP)
echo.
echo ═══════════════════════════════════════════════
echo   🔥 VERIFICAR FIREWALL RÁPIDO
echo ═══════════════════════════════════════════════
echo.
echo Ejecutando comandos de firewall...
echo.
netsh advfirewall firewall show rule name="Imperial Frontend" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Regla de firewall NO configurada
    echo.
    echo ¿Deseas crear reglas de firewall automáticamente? (S/N)
    set /p respuesta=
    if /i "%respuesta%"=="S" (
        echo.
        echo Creando reglas... (necesita permisos de administrador)
        netsh advfirewall firewall add rule name="Imperial Frontend" dir=in action=allow protocol=TCP localport=8080
        netsh advfirewall firewall add rule name="Imperial Backend" dir=in action=allow protocol=TCP localport=5000
        echo ✅ Reglas creadas
    )
) else (
    echo ✅ Firewall ya configurado
)

echo.
echo ═══════════════════════════════════════════════
echo.
pause
