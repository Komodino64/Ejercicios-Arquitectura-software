@echo off
REM ============================================
REM 🔧 CAMBIAR MODO DE CONEXION
REM ============================================
REM Cambia entre Docker (localhost) y VM (IP directa)
REM ============================================

echo.
echo ========================================
echo 🔧 Configurador de Conexion Backend
echo ========================================
echo.
echo Selecciona el modo de despliegue:
echo.
echo [1] Docker (localhost:5000)
echo [2] VM Linux (192.168.1.39:5000)
echo.

set /p opcion="Tu opcion (1 o 2): "

if "%opcion%"=="1" (
    echo.
    echo ⚙️  Configurando para Docker...
    
    powershell -Command "(Get-Content 'public\js\api-config.js') -replace \"BASE_URL: 'http://192.168.1.39:5000/api'\", \"BASE_URL: 'http://localhost:5000/api'\" | Set-Content 'public\js\api-config.js'"
    
    echo ✅ Configurado para Docker
    echo.
    echo Ahora ejecuta:
    echo   docker compose up -d
    echo.
    echo Frontend estará en: http://localhost:8080
    
) else if "%opcion%"=="2" (
    echo.
    echo ⚙️  Configurando para VM Linux...
    
    powershell -Command "(Get-Content 'public\js\api-config.js') -replace \"BASE_URL: 'http://localhost:5000/api'\", \"BASE_URL: 'http://192.168.1.39:5000/api'\" | Set-Content 'public\js\api-config.js'"
    
    echo ✅ Configurado para VM Linux
    echo.
    echo Asegurate que el backend esté corriendo en la VM:
    echo   ssh komodo64@192.168.1.39
    echo   cd ~/imperial-backend
    echo   node server.js
    echo.
    echo Luego inicia el frontend:
    echo   cd public
    echo   python -m http.server 8080
    
) else (
    echo.
    echo ❌ Opcion invalida
)

echo.
pause
