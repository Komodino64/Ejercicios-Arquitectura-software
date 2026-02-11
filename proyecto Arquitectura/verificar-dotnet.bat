@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════
echo   🔍 VERIFICAR .NET SDK
echo ═══════════════════════════════════════════════
echo.

where dotnet >nul 2>&1
if errorlevel 1 (
    echo ❌ .NET SDK NO está instalado
    echo.
    echo 📥 NECESITAS INSTALARLO:
    echo.
    echo    1. Abre: https://dotnet.microsoft.com/download/dotnet/6.0
    echo    2. Descarga: SDK x64 para Windows
    echo    3. Instala: Siguiente, Siguiente, Finalizar
    echo    4. Reinicia CMD/PowerShell
    echo    5. Ejecuta este script otra vez
    echo.
    echo ¿Abrir página de descarga ahora? (S/N)
    set /p respuesta=
    if /i "%respuesta%"=="S" (
        start https://dotnet.microsoft.com/download/dotnet/6.0
    )
) else (
    echo ✅ .NET SDK INSTALADO
    echo.
    dotnet --version
    echo.
    dotnet --list-sdks
    echo.
    echo ═══════════════════════════════════════════════
    echo   ✅ TODO LISTO PARA COMPILAR
    echo ═══════════════════════════════════════════════
    echo.
    echo Ejecuta: compilar-stress-test.bat
)

echo.
pause
