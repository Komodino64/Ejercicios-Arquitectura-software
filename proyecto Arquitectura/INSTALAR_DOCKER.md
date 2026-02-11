# ⚡ INSTALACIÓN RÁPIDA DE DOCKER

## 🪟 Windows

### Paso 1: Descargar Docker Desktop
**Link directo**: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe

O desde la página oficial:
https://www.docker.com/products/docker-desktop/

### Paso 2: Instalar
1. Ejecutar el instalador descargado
2. Seguir el asistente de instalación
3. **IMPORTANTE**: Habilitar WSL 2 cuando lo solicite
4. Reiniciar el PC si es necesario

### Paso 3: Verificar instalación
Abrir PowerShell y ejecutar:
```powershell
docker --version
docker compose version
```

Deberías ver algo como:
```
Docker version 24.0.7
Docker Compose version v2.23.0
```

### Paso 4: Probar que funciona
```powershell
docker run hello-world
```

## ⚙️ Configuración Recomendada

### Docker Desktop Settings:
1. Abrir Docker Desktop
2. Settings → General:
   - ✅ Start Docker Desktop when you log in
   - ✅ Use WSL 2 based engine
3. Settings → Resources:
   - **CPUs**: Mínimo 2, Recomendado 4
   - **Memory**: Mínimo 4GB, Recomendado 8GB
   - **Swap**: 1GB
4. Apply & Restart

## 🚀 Una Vez Instalado Docker

### Construir y ejecutar el proyecto:
```powershell
cd "c:\arquitectura-software-main\proyecto Arquitectura"

# Construir imágenes
docker compose build

# Iniciar servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Verificar que todo esté corriendo
docker compose ps
```

### Acceder a la aplicación:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Admin: admin@imperialluxury.com / admin123

## 🐛 Solución de Problemas

### Error: "Docker daemon is not running"
1. Abrir Docker Desktop manualmente
2. Esperar a que inicie completamente (ícono debe estar verde)
3. Intentar de nuevo

### Error: "WSL 2 installation is incomplete"
```powershell
# Ejecutar como Administrador
wsl --install
wsl --set-default-version 2

# Reiniciar PC
```

### Error: "Access Denied"
- Ejecutar PowerShell como Administrador
- Asegurar que tu usuario esté en el grupo "docker-users"

### Docker Desktop no inicia
1. Desinstalar Docker Desktop
2. Reiniciar PC
3. Instalar de nuevo
4. Habilitar virtualización en BIOS (si está deshabilitada)

## 📦 Alternativa: Linux en VM

Si Docker Desktop no funciona en tu Windows, podés usar la VM de Linux que ya tenés:

```bash
# En la VM Linux (SSH)
ssh komodo64@192.168.1.39

# Instalar Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Dar permisos a tu usuario
sudo usermod -aG docker $USER
newgrp docker

# Verificar
docker --version
docker-compose --version

# Copiar proyecto a la VM y ejecutar
docker-compose up -d
```

## ⏱️ Estimación de Tiempo

- Descarga Docker Desktop: ~5 minutos
- Instalación: ~5 minutos
- Primera construcción del proyecto: ~3-5 minutos
- **Total**: ~15 minutos

## 🎯 Para la Entrega

Una vez Docker funcione:

```powershell
# 1. Construir imágenes
docker compose build

# 2. Iniciar todo
docker compose up -d

# 3. Verificar servicios
docker compose ps

# 4. Mostrar que funciona
# Abrir navegador: http://localhost:8080
# Hacer login como admin
# Crear un vehículo de prueba

# 5. Ver logs (mostrar en la presentación)
docker compose logs backend

# 6. Detener servicios
docker compose down
```

---

**💡 Atajo Ultra Rápido**: Si no tenés tiempo para instalar Docker Desktop, podés demostrar el proyecto usando el setup actual (Python + Node.js en VM) que ya funciona. Docker es un plus, no un requisito obligatorio.
