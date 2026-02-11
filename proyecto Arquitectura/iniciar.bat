@echo off
REM ============================================
REM 🚀 DESPLIEGUE RÁPIDO - Imperial Luxury Cars
REM ============================================
REM Script alternativo sin Docker
REM ============================================

echo.
echo ========================================
echo 🚗 Imperial Luxury Cars - Inicio Rapido
echo ========================================
echo.

REM Verificar si Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL%==0 (
    echo ✅ Docker detectado - Usando Docker Compose
    echo.
    echo [1/3] Construyendo imagenes Docker...
    docker compose build
    
    echo.
    echo [2/3] Iniciando servicios...
    docker compose up -d
    
    echo.
    echo [3/3] Verificando estado...
    docker compose ps
    
    echo.
    echo ========================================
    echo ✅ APLICACION LISTA
    echo ========================================
    echo Frontend: http://localhost:8080
    echo Backend:  http://localhost:5000
    echo Admin:    admin@imperialluxury.com / admin123
    echo.
    echo Para ver logs: docker compose logs -f
    echo Para detener:  docker compose down
    echo ========================================
) else (
    echo ⚠️  Docker NO detectado - Usando metodo local
    echo.
    echo Necesitas 2 terminales:
    echo.
    echo TERMINAL 1 - Backend (Linux VM):
    echo   ssh komodo64@192.168.1.39
    echo   cd ~/imperial-backend
    echo   node server.js
    echo.
    echo TERMINAL 2 - Frontend (Windows):
    echo   cd "%~dp0public"
    echo   python -m http.server 8080
    echo.
    echo Una vez iniciados, abrir: http://localhost:8080
    echo.
    
    set /p respuesta="¿Iniciar frontend local ahora? (S/N): "
    if /i "%respuesta%"=="S" (
        echo.
        echo 🌐 Iniciando servidor frontend en puerto 8080...
        cd "%~dp0public"
        start "Imperial Frontend" python -m http.server 8080
        echo.
        echo ✅ Frontend iniciado
        echo.
        echo IMPORTANTE: Inicia el backend en la VM Linux manualmente
        echo.
        timeout /t 3 >nul
        start http://localhost:8080
    )
)

echo.
pause
