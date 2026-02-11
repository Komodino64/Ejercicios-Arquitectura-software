# 🚗 Imperial Luxury Cars - Aplicación de Escritorio

Aplicación de escritorio para Windows que empaqueta la página web completa en un ejecutable (.exe).

## 📋 Características

- ✅ **Ejecutable único** - Un solo archivo .exe con todo incluido
- ✅ **Interfaz nativa** - Ventana de Windows con controles nativos
- ✅ **WebView2** - Motor de navegador Chromium moderno embebido
- ✅ **Sin instalación** - Self-contained, incluye .NET Runtime
- ✅ **Servidor HTTP interno** - Sirve archivos web sin necesidad de Docker para el frontend
- ✅ **DevTools integrados** - Depuración con F12
- ✅ **Conecta al backend** - Se conecta a localhost:5000 automáticamente

## 🏗️ Arquitectura

```
ImperialLuxuryCars.exe
│
├── WebView2 (Chromium)
│   └── Muestra la página web
│
├── Servidor HTTP (puerto 9999)
│   └── Sirve archivos de wwwroot/
│
└── Backend API (localhost:5000)
    └── Docker container existente
```

## 📦 Requisitos

### Para compilar:
- .NET 6.0 SDK o superior
- Windows 10/11

### Para ejecutar:
- WebView2 Runtime (incluido en Windows 11, se instala automático en Windows 10)
- Backend corriendo (Docker o Node.js)

## 🔨 Compilación

### Opción 1: Script automático
```cmd
compilar-app-desktop.bat
```

Este script:
1. ✅ Verifica .NET SDK
2. ✅ Copia archivos del frontend a `wwwroot/`
3. ✅ Restaura dependencias NuGet
4. ✅ Compila el proyecto
5. ✅ Publica ejecutable único en `bin-desktop/`

### Opción 2: Manual
```cmd
cd ImperialCarsApp

# Copiar archivos web
xcopy /E /I /Y ..\public\* wwwroot\

# Compilar
dotnet restore
dotnet build -c Release

# Publicar ejecutable
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o ..\bin-desktop
```

## 🚀 Ejecución

### 1. Iniciar Backend
```cmd
docker compose up -d
```

**O si no usas Docker:**
```cmd
cd backend
npm install
npm start
```

Backend debe estar en: `http://localhost:5000`

### 2. Ejecutar aplicación
```cmd
bin-desktop\ImperialLuxuryCars.exe
```

## 🎯 Funcionalidades

### Barra de herramientas
- **🔄 Recargar** - Recarga la página web
- **🔧 DevTools** - Abre herramientas de desarrollo (Ctrl+Shift+I)

### Ventana
- Tamaño inicial: 1600x900
- Inicia maximizada
- Redimensionable
- Posición centrada en pantalla

### Estado
- Muestra estado de conexión en la barra superior
- Indica cuando la página está cargando o hay errores

## 🔧 Configuración

### Cambiar puerto del servidor interno
Editar `MainWindow.xaml.cs`:
```csharp
private const int PORT = 9999; // Cambiar a otro puerto si es necesario
```

### Cambiar URL del backend
Editar `public/js/api-config.js` antes de compilar:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Tu backend
```

## 📁 Estructura del proyecto

```
ImperialCarsApp/
├── ImperialCarsApp.csproj    # Configuración del proyecto
├── App.xaml                   # Definición de la aplicación WPF
├── App.xaml.cs               # Código de la aplicación
├── MainWindow.xaml           # UI de la ventana principal
├── MainWindow.xaml.cs        # Lógica de la ventana (servidor HTTP + WebView2)
├── wwwroot/                  # Archivos web (copiados desde public/)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
└── README.md
```

## 🐛 Solución de problemas

### "No se puede iniciar el servidor en puerto 9999"
**Causa:** Puerto ocupado por otra aplicación

**Solución:**
1. Cambiar puerto en `MainWindow.xaml.cs` (línea `private const int PORT = 9999;`)
2. O cerrar la aplicación que usa ese puerto

### "Error al inicializar WebView2"
**Causa:** WebView2 Runtime no instalado

**Solución:**
1. Descargar: https://go.microsoft.com/fwlink/p/?LinkId=2124703
2. Instalar WebView2 Runtime
3. Reiniciar aplicación

### "404 - File Not Found"
**Causa:** Archivos no copiados a `wwwroot/`

**Solución:**
```cmd
cd ImperialCarsApp
xcopy /E /I /Y ..\public\* wwwroot\
```

### "Cannot connect to backend"
**Causa:** Backend no está corriendo

**Solución:**
```cmd
# Verificar Docker
docker compose ps

# O iniciar Docker
docker compose up -d

# Verificar que backend responda
curl http://localhost:5000
```

### Windows Defender bloquea el ejecutable
**Causa:** Ejecutable sin firma digital (normal en desarrollo)

**Solución:**
1. Click derecho en el archivo .exe
2. Propiedades
3. Desbloquear
4. Aplicar

O agregar excepción en Windows Defender:
1. Configuración → Seguridad de Windows
2. Protección contra virus y amenazas
3. Administrar configuración
4. Agregar exclusión → Carpeta
5. Seleccionar `bin-desktop\`

## 📊 Tamaño del ejecutable

- **Con Self-Contained**: ~150-200 MB (incluye .NET Runtime + WebView2 + archivos web)
- **Sin Self-Contained**: ~10-20 MB (requiere .NET instalado)

Para reducir tamaño, editar `.csproj`:
```xml
<SelfContained>false</SelfContained>
```

Pero requerirá tener .NET 6.0 Desktop Runtime instalado.

## 🔒 Seguridad

- ✅ Servidor HTTP solo escucha en `localhost` (no accesible desde red)
- ✅ Sin acceso a archivos fuera de `wwwroot/`
- ✅ HTTPS no necesario (comunicación local)
- ✅ Todas las validaciones del backend se mantienen

## 🎨 Personalización

### Cambiar icono
1. Reemplazar `icon.ico` con tu icono (32x32 o 256x256)
2. Recompilar

### Cambiar título de ventana
Editar `MainWindow.xaml`:
```xml
<Window Title="Tu Título Aquí" ...>
```

### Cambiar tamaño inicial
```xml
<Window Height="900" Width="1600" ...>
```

## 📝 Notas

- La aplicación usa un servidor HTTP simple (`HttpListener`) en puerto 9999
- WebView2 usa el motor Chromium (mismo que Edge/Chrome)
- Los archivos web se sirven desde la carpeta `wwwroot/` incluida en el .exe
- El backend sigue siendo necesario (Docker o Node.js)
- No necesitas navegador, la app incluye su propio motor de renderizado

## 🚀 Distribución

Para distribuir a otros usuarios:

1. **Compilar:**
   ```cmd
   compilar-app-desktop.bat
   ```

2. **Incluir:**
   - `bin-desktop\ImperialLuxuryCars.exe`
   - `bin-desktop\wwwroot\` (si no está embebida)

3. **Requisitos del usuario:**
   - Windows 10/11
   - WebView2 Runtime (auto-instala)
   - Backend corriendo (o incluir Docker Desktop)

4. **Opcional - Instalador:**
   Crear instalador con:
   - **Inno Setup** (gratis)
   - **WiX Toolset** (gratis)
   - **Advanced Installer** (comercial)

## 📞 Soporte

Si tienes problemas:
1. Verifica que Docker esté corriendo: `docker compose ps`
2. Verifica que backend responda: `curl http://localhost:5000`
3. Abre DevTools (🔧) y revisa console
4. Revisa logs en Output de Visual Studio

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 11, 2026  
**Plataforma:** Windows 10/11 (x64)
