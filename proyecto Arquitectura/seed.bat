@echo off
echo ============================================
echo    SEED DATABASE - Imperial Luxury Cars
echo ============================================
echo.
echo Este script poblara la base de datos con 16 vehiculos de ejemplo.
echo.
echo ATENCION: Si ya hay vehiculos, se eliminaran despues de 3 segundos.
echo          Presiona Ctrl+C en el contenedor para cancelar.
echo.
pause

echo.
echo Ejecutando seed...
echo.

docker compose exec backend node seed.js

echo.
echo ============================================
echo Seed completado!
echo.
echo Abre la aplicacion:
echo   Frontend: http://localhost:8080
echo   Backend:  http://localhost:5000
echo.
echo Credenciales admin:
echo   Email:    admin@imperialluxury.com
echo   Password: admin123
echo ============================================
echo.
pause
