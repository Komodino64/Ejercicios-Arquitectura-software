@echo off
echo ============================================
echo   STRESS TEST - Imperial Luxury Cars API
echo ============================================
echo.
echo Verificando que Docker este corriendo...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no esta corriendo
    echo Por favor inicia Docker Desktop
    pause
    exit /b 1
)

echo.
echo Verificando contenedores...
docker compose ps

echo.
echo ====================
echo EJECUTANDO PRUEBA DE ESTRES
echo ====================
echo.
echo Presiona cualquier tecla para iniciar...
pause >nul

echo.
echo Iniciando test...
node stress-test.js

echo.
echo ============================================
echo   PRUEBA COMPLETADA
echo ============================================
echo.
pause
