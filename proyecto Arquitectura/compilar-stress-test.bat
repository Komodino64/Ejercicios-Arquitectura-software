@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════
echo   🔨 COMPILAR STRESS TEST - Imperial Luxury
echo ═══════════════════════════════════════════════
echo.

:: Verificar si .NET SDK está instalado
where dotnet >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: .NET SDK no está instalado
    echo.
    echo 📥 Descarga .NET 6.0 SDK desde:
    echo    https://dotnet.microsoft.com/download/dotnet/6.0
    echo.
    pause
    exit /b 1
)

echo ✅ .NET SDK encontrado
dotnet --version
echo.

cd StressTest

echo ═══════════════════════════════════════════════
echo   📦 COMPILANDO...
echo ═══════════════════════════════════════════════
echo.

:: Compilar proyecto
dotnet restore
dotnet build -c Release

if errorlevel 1 (
    echo.
    echo ❌ ERROR en la compilación
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════
echo   📤 PUBLICANDO EJECUTABLE...
echo ═══════════════════════════════════════════════
echo.

:: Publicar como ejecutable único
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true /p:IncludeNativeLibrariesForSelfExtract=true

if errorlevel 1 (
    echo.
    echo ❌ ERROR en la publicación
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════
echo   ✅ COMPILACIÓN EXITOSA
echo ═══════════════════════════════════════════════
echo.

:: Copiar ejecutable a carpeta raíz
copy "bin\Release\net6.0\win-x64\publish\ImperialStressTest.exe" "..\ImperialStressTest.exe" >nul

if exist "..\ImperialStressTest.exe" (
    echo ✅ Ejecutable creado: ImperialStressTest.exe
    echo.
    echo 📍 Ubicación: %cd%\..\ImperialStressTest.exe
    echo.
    echo 🚀 Para ejecutarlo:
    echo    1. Doble click en ImperialStressTest.exe
    echo    2. O desde CMD: ImperialStressTest.exe
    echo    3. Con IP custom: ImperialStressTest.exe http://192.168.1.5:5000
) else (
    echo ⚠️  Ejecutable compilado en: bin\Release\net6.0\win-x64\publish\
)

cd ..

echo.
echo ═══════════════════════════════════════════════
echo.
pause
