# 🚀 GUÍA RÁPIDA: INICIAR SISTEMA COMPLETO

## Imperial Luxury Cars - Instrucciones de Inicio

Esta guía te muestra cómo prender todo el sistema paso a paso.

---

## 📋 REQUISITOS PREVIOS

Antes de iniciar, asegúrate de tener instalado:
- ✅ Docker Desktop (debe estar corriendo)
- ✅ Node.js (para desarrollo local opcional)
- ✅ PowerShell (Windows)

---

## 🔥 INICIO RÁPIDO (3 COMANDOS)

```powershell
# 1. Navegar a la carpeta del proyecto
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# 2. Iniciar Docker (Backend + Frontend + Base de Datos)
docker-compose up -d

# 3. Iniciar Aplicación de Escritorio (opcional)
.\run-desktop-app.ps1
```

**¡Listo!** El sistema estará funcionando en menos de 2 minutos.

---

## 📖 PASO A PASO DETALLADO

### 1️⃣ VERIFICAR DOCKER DESKTOP

```powershell
# Verificar que Docker esté corriendo
docker --version
```

Si no está instalado, descarga Docker Desktop: https://www.docker.com/products/docker-desktop

**Asegúrate de que Docker Desktop esté abierto antes de continuar.**

---

### 2️⃣ INICIAR CONTENEDORES DOCKER

```powershell
# Navegar a la carpeta del proyecto
cd "C:\arquitectura-software-main\proyecto Arquitectura"

# Iniciar todos los servicios en segundo plano
docker-compose up -d
```

**Esto inicia 3 contenedores:**
- 🟢 **Backend** (Node.js/Express) → Puerto 5000
- 🟢 **Frontend** (Nginx) → Puerto 8080
- 🟢 **MongoDB** → Puerto 27017

**Tiempo estimado:** 30-60 segundos

---

### 3️⃣ VERIFICAR QUE TODO ESTÉ FUNCIONANDO

```powershell
# Ver estado de los contenedores
docker ps

# Deberías ver 3 contenedores corriendo:
# - backend
# - frontend  
# - mongodb
```

**Prueba rápida de los servicios:**

```powershell
# Probar Backend
Invoke-RestMethod http://localhost:5000/

# Probar Frontend (abrirá navegador)
Start-Process "http://localhost:8080"
```

---

### 4️⃣ INICIAR APLICACIÓN DE ESCRITORIO (OPCIONAL)

```powershell
# Ejecutar script automático
.\run-desktop-app.ps1
```

**Este script hace 4 cosas:**
1. ✅ Verifica que el backend esté activo
2. ✅ Sincroniza archivos actualizados (public → wwwroot)
3. ✅ Verifica que el ejecutable exista
4. ✅ Lanza ImperialLuxuryCars.exe

**La app se abrirá automáticamente en puerto 9999.**

---

## 🌐 URLs DEL SISTEMA

### Aplicación Web (Navegador)
| Página | URL |
|--------|-----|
| **Inicio** | http://localhost:8080/ |
| **Login** | http://localhost:8080/login.html |
| **Registro** | http://localhost:8080/register.html |
| **Admin** | http://localhost:8080/admin.html |
| **Mis Anuncios** | http://localhost:8080/my-ads.html |
| **Contacto** | http://localhost:8080/contact.html |

### Aplicación de Escritorio
| Página | URL |
|--------|-----|
| **Inicio** | http://localhost:9999/ |
| **Login** | http://localhost:9999/login.html |
| **Registro** | http://localhost:9999/register.html |
| **Admin** | http://localhost:9999/admin.html |
| **Mis Anuncios** | http://localhost:9999/my-ads.html |

### API Backend
| Endpoint | URL |
|----------|-----|
| **Health Check** | http://localhost:5000/ |
| **API Base** | http://localhost:5000/api/ |

---

## 🧪 PROBAR EL SISTEMA

### Opción 1: Script Automático de Pruebas

```powershell
# Ejecutar todas las pruebas API (9 tests)
.\test-api.ps1
```

**Prueba:**
- ✅ Health Check
- ✅ Autenticación (Login)
- ✅ Listar Vehículos
- ✅ Ver Detalle de Vehículo
- ✅ Crear/Actualizar/Eliminar Vehículo
- ✅ Estadísticas (Admin)
- ✅ Contacto

---

### Opción 2: Pruebas Manuales

```powershell
# 1. Ver todos los vehículos
Invoke-RestMethod http://localhost:5000/api/cars

# 2. Login como admin
$loginBody = @{
    email = "admin@imperialluxury.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token

Write-Host "Token: $token"

# 3. Crear un vehículo (requiere token)
$headers = @{ Authorization = "Bearer $token" }
$newCar = @{
    brand = "Porsche"
    model = "911 GT3 RS"
    year = 2024
    price = 250000
    imageUrl = "https://example.com/porsche.jpg"
    description = "Vehículo de prueba"
    color = "Azul"
    mileage = 0
    engineType = "Gasolina"
    transmission = "Manual"
    status = "Disponible"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/cars" -Method POST -Body $newCar -ContentType "application/json" -Headers $headers
```

---

## 🛑 DETENER EL SISTEMA

### Detener Solo la App de Escritorio

```powershell
# Buscar proceso
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"}

# Detener por PID (reemplaza XXXX con el PID mostrado)
Stop-Process -Id XXXX -Force
```

---

### Detener Docker (Backend/Frontend/DB)

```powershell
# Detener todos los contenedores
docker-compose down

# Detener Y eliminar volúmenes (CUIDADO: borra la base de datos)
docker-compose down -v
```

---

### Detener TODO

```powershell
# 1. Detener app de escritorio
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"} | Stop-Process -Force

# 2. Detener Docker
docker-compose down
```

---

## 🔄 REINICIAR EL SISTEMA

### Reinicio Completo

```powershell
# 1. Detener todo
docker-compose down
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"} | Stop-Process -Force

# 2. Esperar 5 segundos
Start-Sleep -Seconds 5

# 3. Iniciar Docker nuevamente
docker-compose up -d

# 4. Esperar a que Docker esté listo (30 segundos)
Start-Sleep -Seconds 30

# 5. Iniciar app de escritorio
.\run-desktop-app.ps1
```

---

### Reinicio Solo de la App de Escritorio

```powershell
# Detener
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"} | Stop-Process -Force

# Esperar 2 segundos
Start-Sleep -Seconds 2

# Reiniciar
.\run-desktop-app.ps1
```

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Verificar Estado de Docker

```powershell
# Ver contenedores activos
docker ps

# Ver logs del backend
docker logs backend

# Ver logs del frontend
docker logs frontend

# Ver logs de MongoDB
docker logs mongodb
```

---

### Verificar Puertos en Uso

```powershell
# Backend (puerto 5000)
netstat -ano | Select-String "5000"

# Frontend (puerto 8080)
netstat -ano | Select-String "8080"

# MongoDB (puerto 27017)
netstat -ano | Select-String "27017"

# App Escritorio (puerto 9999)
netstat -ano | Select-String "9999"
```

---

### Verificar Procesos Activos

```powershell
# Ver procesos de Node.js
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Ver procesos de la app
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"}

# Ver procesos de Docker
Get-Process | Where-Object {$_.ProcessName -like "*docker*"}
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Puerto 5000 ya está en uso"

```powershell
# Encontrar proceso usando puerto 5000
netstat -ano | Select-String "5000"

# Detener proceso por PID
Stop-Process -Id XXXX -Force

# Reiniciar Docker
docker-compose down
docker-compose up -d
```

---

### Problema 2: "No se pudo iniciar el servidor en puerto 9999"

**Causa:** Ya hay una instancia de la app corriendo.

```powershell
# Detener todas las instancias
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"} | Stop-Process -Force

# Esperar y reiniciar
Start-Sleep -Seconds 2
.\run-desktop-app.ps1
```

---

### Problema 3: "Cannot GET /api/auth/register"

**Causa:** Estás navegando a una URL de API directamente.

**Solución:** Usa las páginas HTML correctas:
- ❌ NO: `http://localhost:9999/api/auth/register`
- ✅ SÍ: `http://localhost:9999/register.html`

---

### Problema 4: "Docker no está instalado"

**Solución:**
1. Descargar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instalar y reiniciar computadora
3. Abrir Docker Desktop
4. Ejecutar `docker --version` para confirmar

---

### Problema 5: "La base de datos está vacía"

```powershell
# Reiniciar con datos limpios
docker-compose down -v
docker-compose up -d

# Esperar 30 segundos y verificar
Start-Sleep -Seconds 30
Invoke-RestMethod http://localhost:5000/api/cars
```

Si no hay vehículos, revisa los logs:
```powershell
docker logs backend
```

---

## 📊 VERIFICACIÓN FINAL

Después de iniciar todo, verifica que funcione correctamente:

```powershell
# Test 1: Backend activo
Invoke-RestMethod http://localhost:5000/

# Test 2: Frontend activo
Start-Process "http://localhost:8080"

# Test 3: MongoDB activo
docker exec -it mongodb mongosh --eval "db.adminCommand('ping')"

# Test 4: Ver vehículos
$cars = Invoke-RestMethod http://localhost:5000/api/cars
Write-Host "Total vehículos: $($cars.Length)"

# Test 5: App de escritorio
Get-Process | Where-Object {$_.ProcessName -like "*Imperial*"}
```

**Si todos los tests pasan:** ✅ Sistema funcionando correctamente

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **Presentación del Proyecto:** `docs/PRESENTACION_PROYECTO.md`
- **Guía de Despliegue:** `docs/DEPLOY_COMPLETO.md`
- **Pruebas de API:** `docs/PRUEBAS_API.md`
- **Marketplace:** `docs/MARKETPLACE_COMPLETO.md`

---

## 👤 USUARIOS DE PRUEBA

### Administrador
- **Email:** `admin@imperialluxury.com`
- **Password:** `Admin123!`
- **Permisos:** Todos (crear, editar, eliminar, ver stats)

### Usuario Normal
- **Email:** `user@example.com`
- **Password:** `User123!`
- **Permisos:** Ver catálogo, contactar

---

## 🎯 CHECKLIST DE INICIO

Usa este checklist cada vez que inicies el sistema:

- [ ] Docker Desktop está abierto
- [ ] Ejecuté `docker-compose up -d`
- [ ] Esperé 30-60 segundos
- [ ] Verifiqué con `docker ps` (3 contenedores)
- [ ] Probé backend: `http://localhost:5000/`
- [ ] Probé frontend: `http://localhost:8080/`
- [ ] (Opcional) Ejecuté `.\run-desktop-app.ps1`
- [ ] (Opcional) Ejecuté `.\test-api.ps1`
- [ ] Todo funciona correctamente ✅

---

## 📞 SOPORTE

Si encuentras problemas:

1. **Revisa los logs:** `docker logs backend`
2. **Verifica puertos:** `netstat -ano | Select-String "5000|8080|9999"`
3. **Reinicia Docker:** `docker-compose down` → `docker-compose up -d`
4. **Lee este documento completo**

---

**🎉 ¡Sistema Listo para Usar!**

Última actualización: Febrero 2026
