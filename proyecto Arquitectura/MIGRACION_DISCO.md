# 💾 GUÍA COMPLETA: MIGRACIÓN A NUEVO DISCO

## Imperial Luxury Cars - Backup y Reinstalación

Esta guía te ayudará a respaldar todo el proyecto y reinstalarlo en un nuevo disco sin perder nada.

---

## 🎯 ¿QUÉ OPCIÓN ELEGIR?

### Opción 1: CLONAR TODO EL DISCO (Recomendado)
**⏱️ Tiempo:** 2-4 horas | **📚 Guía:** [CLONAR_DISCO_COMPLETO.md](CLONAR_DISCO_COMPLETO.md)

✅ **Usa esta opción si:**
- Quieres migrar TODO (Windows + programas + proyecto)
- Tu sistema actual funciona bien
- No quieres reinstalar nada
- Prefieres la solución más rápida

**Resultado:** Sistema idéntico en disco nuevo, todo funciona inmediatamente.

---

### Opción 2: REINSTALAR DESDE CERO (Esta guía)
**⏱️ Tiempo:** 5-8 horas | **📚 Guía:** Esta página

✅ **Usa esta opción si:**
- Solo quieres migrar el proyecto
- Vas a formatear e instalar Windows limpio
- Quieres sistema fresco sin archivos viejos
- Te gusta configurar todo manualmente

**Resultado:** Windows limpio + proyecto restaurado + configuración manual.

---

> **💡 Recomendación:** Si tu Windows funciona bien, usa **Opción 1 (Clonar)**. Es más rápido y seguro.

---

## 📦 PARTE 1: HACER BACKUP (ANTES DE FORMATEAR)

### Paso 1: Respaldar Código del Proyecto

```powershell
# Navega a tu carpeta de proyectos
cd C:\

# Crea un backup completo
$fecha = Get-Date -Format "yyyy-MM-dd"
$backupPath = "C:\BACKUP_IMPERIAL_$fecha"
New-Item -ItemType Directory -Path $backupPath -Force

# Copiar proyecto completo
Copy-Item -Path "C:\arquitectura-software-main" -Destination $backupPath -Recurse -Force

Write-Host "✅ Backup creado en: $backupPath"
```

**Archivos importantes que se respaldarán:**
- ✅ Todo el código fuente (`public/`, `backend/`, `bin-desktop/`)
- ✅ Docker compose y configuración
- ✅ Documentación completa
- ✅ Scripts de pruebas y lanzamiento
- ✅ Historial de Git

---

### Paso 2: Exportar Base de Datos MongoDB

```powershell
# Verificar que Docker esté corriendo
docker ps

# Exportar toda la base de datos
docker exec imperial-mongodb mongodump --out=/tmp/backup

# Crear carpeta local para el backup
New-Item -ItemType Directory -Path "C:\BACKUP_IMPERIAL_DB" -Force

# Copiar backup desde el contenedor
docker cp imperial-mongodb:/tmp/backup "C:\BACKUP_IMPERIAL_DB"

Write-Host "✅ Base de datos exportada a: C:\BACKUP_IMPERIAL_DB"
```

---

### Paso 3: Guardar Credenciales y Configuración

**Crea un archivo de texto con toda tu información importante:**

```powershell
# Crear archivo de configuración
$config = @"
==============================================
IMPERIAL LUXURY CARS - CONFIGURACIÓN
==============================================

USUARIOS:
- Admin Email: admin@imperialluxury.com
- Admin Password: Admin123!

PUERTOS:
- Backend: 5000
- Frontend: 8080
- MongoDB: 27017
- Desktop App: 9999

GITHUB:
- Repositorio: https://github.com/Komodino64/Ejercicios-Arquitectura-software.git
- Usuario: [TU_USUARIO]
- Token: [TU_TOKEN_SI_LO_TIENES]

CLOUDINARY:
- Cloud Name: [TU_CLOUD_NAME]
- API Key: [TU_API_KEY]
- API Secret: [TU_API_SECRET]

NOTAS:
- Último commit: $(git log -1 --pretty=format:"%h - %s (%ci)")
- Docker Compose version: $(docker-compose --version)
- Node version: $(node --version)

==============================================
"@

$config | Out-File -FilePath "C:\BACKUP_IMPERIAL_CONFIG.txt" -Encoding UTF8
Write-Host "✅ Configuración guardada en: C:\BACKUP_IMPERIAL_CONFIG.txt"
```

---

### Paso 4: Copiar Todo a USB o Nube

**Opción A: USB/Disco Externo**

```powershell
# Reemplaza "E:\" con la letra de tu USB
$usb = "E:\BACKUP_IMPERIAL"
New-Item -ItemType Directory -Path $usb -Force

# Copiar todo
Copy-Item -Path "C:\BACKUP_IMPERIAL_*" -Destination $usb -Recurse -Force
Copy-Item -Path "C:\arquitectura-software-main" -Destination "$usb\proyecto" -Recurse -Force

Write-Host "✅ Todo copiado a USB: $usb"
```

**Opción B: GitHub (ya está sincronizado)**

```powershell
# Verificar que todo esté subido
cd "C:\arquitectura-software-main\proyecto Arquitectura"
git status
git log -1

# Si hay cambios sin subir:
git add .
git commit -m "Backup completo antes de migración"
git push
```

**Opción C: OneDrive/Google Drive**

```powershell
# Copiar a tu carpeta de OneDrive
Copy-Item -Path "C:\arquitectura-software-main" -Destination "$env:OneDrive\BACKUP_IMPERIAL" -Recurse -Force
```

---

## 🔧 PARTE 2: INSTALACIÓN EN DISCO NUEVO (DESPUÉS DE FORMATEAR)

### Paso 1: Instalar Software Base

**Descarga e instala en este orden:**

1. **Google Chrome o Edge** (para descargas)
   - URL: https://www.google.com/chrome/

2. **Git for Windows**
   - URL: https://git-scm.com/download/win
   - ✅ Durante instalación: Marca "Git Bash Here"
   - ✅ Editor: Visual Studio Code (si está instalado) o Vim

3. **Node.js LTS** (versión 18 o superior)
   - URL: https://nodejs.org/
   - ✅ Incluye npm automáticamente
   - Verificar: `node --version` y `npm --version`

4. **Docker Desktop**
   - URL: https://www.docker.com/products/docker-desktop
   - ✅ Requiere WSL 2 (instala automáticamente)
   - ✅ Reiniciar después de instalar
   - ✅ Abrir Docker Desktop y esperar a que inicie

5. **Visual Studio Code** (opcional pero recomendado)
   - URL: https://code.visualstudio.com/
   - Extensiones recomendadas: Docker, GitLens, ES7+ React/Redux

6. **.NET 6.0 Runtime** (para la app de escritorio)
   - URL: https://dotnet.microsoft.com/download/dotnet/6.0
   - Descargar: .NET Desktop Runtime 6.0.x (Windows x64)

---

### Paso 2: Configurar Git

```powershell
# Abrir PowerShell y configurar Git
git config --global user.name "TU_NOMBRE"
git config --global user.email "tu_email@ejemplo.com"

# Verificar configuración
git config --list
```

---

### Paso 3: Restaurar Proyecto desde GitHub

```powershell
# Crear carpeta de proyectos
New-Item -ItemType Directory -Path "C:\arquitectura-software-main" -Force
cd C:\arquitectura-software-main

# Clonar repositorio
git clone https://github.com/Komodino64/Ejercicios-Arquitectura-software.git .

# O si ya tienes la carpeta del backup:
cd C:\
Copy-Item -Path "TU_USB\BACKUP_IMPERIAL\proyecto" -Destination "C:\arquitectura-software-main" -Recurse -Force
```

---

### Paso 4: Restaurar Base de Datos

```powershell
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# Iniciar Docker
docker-compose up -d

# Esperar 30 segundos a que MongoDB inicie
Start-Sleep -Seconds 30

# Si tienes backup de la base de datos:
# 1. Copiar backup al contenedor
docker cp "C:\BACKUP_IMPERIAL_DB\backup" imperial-mongodb:/tmp/

# 2. Restaurar datos
docker exec imperial-mongodb mongorestore /tmp/backup

Write-Host "✅ Base de datos restaurada"
```

**Si NO tienes backup de la DB:** No te preocupes, el sistema funciona con la base de datos vacía y puedes agregar vehículos manualmente desde el admin.

---

### Paso 5: Instalar Dependencias del Backend

```powershell
cd "C:\arquitectura-software-main\proyecto Arquitectura\backend"

# Instalar todas las dependencias
npm install

Write-Host "✅ Dependencias instaladas"
```

---

### Paso 6: Verificar Archivo .env

```powershell
# Navegar a backend
cd "C:\arquitectura-software-main\proyecto Arquitectura\backend"

# Ver si existe .env
Get-Content .env

# Si no existe o falta información, créalo:
@"
# MongoDB
MONGODB_URI=mongodb://localhost:27017/imperial-luxury-cars

# JWT
JWT_SECRET=imperial-luxury-secret-key-2024-super-secure

# Cloudinary (opcional - para subir imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui

# Server
PORT=5000
NODE_ENV=production
"@ | Out-File -FilePath ".env" -Encoding UTF8
```

---

### Paso 7: Probar que Todo Funcione

```powershell
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# 1. Iniciar Docker
docker-compose up -d

# 2. Esperar 30 segundos
Start-Sleep -Seconds 30

# 3. Verificar contenedores
docker ps

# 4. Probar backend
Invoke-RestMethod http://localhost:5000/

# 5. Probar frontend (abre navegador)
Start-Process "http://localhost:8080"

# 6. Ejecutar pruebas API
.\test-api.ps1

# 7. Iniciar app de escritorio
.\run-desktop-app.ps1
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Antes de Formatear:
- [ ] Backup del código a USB/Nube
- [ ] Backup de base de datos exportado
- [ ] Credenciales guardadas en archivo de texto
- [ ] Último commit subido a GitHub
- [ ] Verificado que GitHub tiene todo (`git status`)

### Después de Formatear:
- [ ] Git instalado (`git --version`)
- [ ] Node.js instalado (`node --version`)
- [ ] Docker Desktop instalado y corriendo
- [ ] .NET 6.0 Runtime instalado
- [ ] Proyecto clonado/restaurado
- [ ] Docker compose corriendo (`docker ps` muestra 3 contenedores)
- [ ] Base de datos restaurada (si tenías backup)
- [ ] Backend responde en localhost:5000
- [ ] Frontend carga en localhost:8080
- [ ] App de escritorio funciona en localhost:9999
- [ ] Pruebas API pasan (`.\test-api.ps1`)

---

## 🎯 LISTA DE DEPENDENCIAS COMPLETA

### Software (Instalar Manualmente):
1. **Git** - Control de versiones
2. **Node.js** - Runtime de JavaScript (incluye npm)
3. **Docker Desktop** - Contenedores (incluye Docker Compose)
4. **.NET 6.0 Runtime** - Para app de escritorio
5. **VS Code** (opcional) - Editor de código

### Paquetes Node.js (Instala automático con `npm install`):
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "express-validator": "^7.0.1",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-mongo-sanitize": "^2.2.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "cloudinary": "^1.41.0",
  "multer": "^1.4.5-lts.1"
}
```

### Contenedores Docker (Arrancan automático):
- Node.js 18 (backend)
- Nginx Alpine (frontend)
- MongoDB 7.0 (base de datos)

---

## 🚨 PROBLEMAS COMUNES AL MIGRAR

### Problema 1: "Docker no inicia"

**Solución:**
```powershell
# Verificar que WSL 2 esté instalado
wsl --list --verbose

# Si no está, instalar WSL 2:
wsl --install
Restart-Computer

# Después del reinicio:
wsl --set-default-version 2
```

---

### Problema 2: "npm install falla"

**Solución:**
```powershell
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
cd "C:\arquitectura-software-main\proyecto Arquitectura\backend"
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install
```

---

### Problema 3: "Puerto 5000 en uso"

**Solución:**
```powershell
# Encontrar qué está usando el puerto
netstat -ano | Select-String "5000"

# Detener proceso (reemplaza XXXX con PID)
Stop-Process -Id XXXX -Force

# Reiniciar Docker
docker-compose down
docker-compose up -d
```

---

### Problema 4: "Git no reconoce credenciales"

**Solución:**
```powershell
# Configurar credenciales
git config --global user.name "TU_NOMBRE"
git config --global user.email "tu_email@ejemplo.com"

# Si necesitas token personal de GitHub:
# 1. Ve a: https://github.com/settings/tokens
# 2. Generate new token (classic)
# 3. Marca: repo, workflow, write:packages
# 4. Copia el token
# 5. Cuando Git pida password, pega el TOKEN (no tu password)
```

---

### Problema 5: "App de escritorio no inicia"

**Solución:**
```powershell
# Verificar .NET Runtime
dotnet --list-runtimes

# Si no aparece .NET 6.0, descarga e instala:
# https://dotnet.microsoft.com/download/dotnet/6.0

# Verificar ejecutable
Test-Path "C:\arquitectura-software-main\proyecto Arquitectura\bin-desktop\ImperialLuxuryCars.exe"

# Sincronizar archivos
.\run-desktop-app.ps1
```

---

## 📁 ESTRUCTURA DE ARCHIVOS A RESPALDAR

```
C:\BACKUP_IMPERIAL/
│
├── proyecto/                          (Todo el código)
│   ├── backend/                       (API Node.js)
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env                       ⚠️ IMPORTANTE
│   │
│   ├── public/                        (Frontend)
│   │   ├── index.html
│   │   ├── admin.html
│   │   ├── js/
│   │   └── css/
│   │
│   ├── bin-desktop/                   (App Escritorio)
│   │   ├── ImperialLuxuryCars.exe     ⚠️ 66 MB
│   │   └── wwwroot/
│   │
│   ├── docs/                          (Documentación)
│   │   ├── PRESENTACION_PROYECTO.md
│   │   ├── DEPLOY_COMPLETO.md
│   │   ├── PRUEBAS_API.md
│   │   └── MARKETPLACE_COMPLETO.md
│   │
│   ├── docker-compose.yml             ⚠️ IMPORTANTE
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── test-api.ps1
│   ├── run-desktop-app.ps1
│   └── INICIAR_SISTEMA.md
│
├── BACKUP_DB/                         (Base de datos exportada)
│   └── backup/
│       ├── imperial-luxury-cars/
│       │   ├── cars.bson
│       │   ├── users.bson
│       │   └── contacts.bson
│
└── CONFIG.txt                         (Credenciales y configuración)
```

---

## 🔐 SEGURIDAD: ¿QUÉ GUARDAR EN PRIVADO?

**⚠️ NUNCA SUBAS A GITHUB PÚBLICO:**
- `.env` (contiene secrets)
- Tokens de API (Cloudinary, etc.)
- Passwords de base de datos

**✅ SÍ PUEDES SUBIR:**
- Todo el código fuente
- Docker compose
- Documentación
- Scripts de PowerShell

---

## 🎓 COMANDOS DE EMERGENCIA

### Si todo falla, empezar de cero:

```powershell
# 1. Detener y eliminar todo Docker
docker-compose down -v
docker system prune -a --volumes -f

# 2. Clonar proyecto limpio
cd C:\
Remove-Item -Path "arquitectura-software-main" -Recurse -Force
git clone https://github.com/Komodino64/Ejercicios-Arquitectura-software.git arquitectura-software-main

# 3. Instalar dependencias
cd "C:\arquitectura-software-main\proyecto Arquitectura\backend"
npm install

# 4. Crear .env básico
@"
MONGODB_URI=mongodb://localhost:27017/imperial-luxury-cars
JWT_SECRET=imperial-luxury-secret-key-2024-super-secure
PORT=5000
"@ | Out-File -FilePath ".env" -Encoding UTF8

# 5. Iniciar todo
cd ..
docker-compose up -d
Start-Sleep -Seconds 30
.\test-api.ps1
```

---

## 📞 CONTACTO DE EMERGENCIA

**Si necesitas ayuda:**
- 📧 Guarda este documento: `MIGRACION_DISCO.md`
- 🌐 Repositorio GitHub: https://github.com/Komodino64/Ejercicios-Arquitectura-software
- 📖 Toda la documentación está en `docs/`

---

## ⏱️ TIEMPO ESTIMADO

**Backup (antes de formatear):** 15-30 minutos  
**Formateo + Instalación Windows:** 1-2 horas  
**Instalación de software:** 30-45 minutos  
**Restauración del proyecto:** 15-30 minutos  
**Verificación completa:** 15 minutos

**TOTAL:** 2.5 - 4 horas aproximadamente

---

## ✨ TIPS FINALES

1. **Haz múltiples backups:** USB + GitHub + Nube
2. **Prueba el backup antes de formatear:** Copia a otra carpeta y verifica que funcione
3. **Toma screenshots:** De configuraciones importantes
4. **Anota los errores:** Si algo falla, busca el error en Google
5. **No tengas prisa:** Ve paso a paso verificando cada cosa

---

**¡Buena suerte con la migración! 🚀**

Última actualización: Febrero 2026
