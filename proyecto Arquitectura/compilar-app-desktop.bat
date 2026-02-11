@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════
echo   📦 COMPILAR APP DE ESCRITORIO
echo   Imperial Luxury Cars Desktop
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

REM Verificar .NET SDK
where dotnet >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: .NET SDK no está instalado
    echo.
    echo Descarga: https://dotnet.microsoft.com/download/dotnet/6.0
    pause
    exit /b 1
)

echo ✅ .NET SDK encontrado
dotnet --version
echo.

REM Verificar que exista la carpeta ImperialCarsApp
if not exist "ImperialCarsApp" (
    echo ❌ Error: No se encuentra la carpeta ImperialCarsApp
    pause
    exit /b 1
)

REM Copiar archivos del frontend a wwwroot
echo 📁 Copiando archivos del frontend...
if not exist "ImperialCarsApp\wwwroot" mkdir "ImperialCarsApp\wwwroot"

REM Copiar archivos públicos
xcopy /E /I /Y "public\*" "ImperialCarsApp\wwwroot\" >nul
if errorlevel 1 (
    echo ⚠️  Advertencia: No se pudieron copiar algunos archivos
)

echo ✅ Archivos copiados
echo.

REM Compilar aplicación
echo 🔨 Compilando aplicación de escritorio...
echo    Esto puede tardar varios minutos...
echo.

cd ImperialCarsApp

dotnet restore
if errorlevel 1 (
    echo ❌ Error en restore
    cd ..
    pause
    exit /b 1
)

dotnet build -c Release
if errorlevel 1 (
    echo ❌ Error en build
    cd ..
    pause
    exit /b 1
)

echo.
echo 📦 Publicando ejecutable único...
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o "..\bin-desktop"
if errorlevel 1 (
    echo ❌ Error en publish
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ═══════════════════════════════════════════════
echo   ✅ COMPILACIÓN EXITOSA
echo ═══════════════════════════════════════════════
echo.

if exist "bin-desktop\ImperialLuxuryCars.exe" (
    echo 📦 Ejecutable creado:
    echo    bin-desktop\ImperialLuxuryCars.exe
    echo.
    dir "bin-desktop\ImperialLuxuryCars.exe" | findstr "ImperialLuxuryCars.exe"
    echo.
    echo 🚀 Para ejecutar:
    echo    1. Asegúrate que Docker esté corriendo: docker compose up -d
    echo    2. Ejecuta: bin-desktop\ImperialLuxuryCars.exe
    echo.
    echo 📝 Requisitos:
    echo    - WebView2 Runtime (se instala automáticamente en Windows 11)
    echo    - Backend corriendo en localhost:5000
) else (
    echo ❌ Error: No se encontró el ejecutable
)

echo.
pause
