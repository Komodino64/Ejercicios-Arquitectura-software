# 🐧 GUÍA: Backend en Linux VM - PASO A PASO

## ⏱️ Tiempo estimado: 30-45 minutos

---

## 📋 OPCIÓN 1: VM LOCAL (Lo que vas a hacer)

### PASO 1: Descargar e Instalar VirtualBox (5 min)

1. **Descargar VirtualBox**:
   - Ve a: https://www.virtualbox.org/wiki/Downloads
   - Descarga "Windows hosts"
   - Instala (siguiente, siguiente, instalar)

### PASO 2: Descargar Ubuntu Server (5 min)

1. **Ubuntu Server 22.04 LTS** (más ligero que Desktop):
   - Ve a: https://ubuntu.com/download/server
   - Descarga "Ubuntu Server 22.04 LTS"
   - Archivo: `ubuntu-22.04-live-server-amd64.iso` (~2GB)

**ALTERNATIVA MÁS RÁPIDA** (si tienes poco tiempo):
   - Ubuntu Server 20.04: https://releases.ubuntu.com/20.04/
   - Más pequeño, más rápido de instalar

### PASO 3: Crear Máquina Virtual (5 min)

1. **Abre VirtualBox** → "Nueva"
2. **Configuración**:
   - Nombre: `Imperial-Backend`
   - Tipo: `Linux`
   - Versión: `Ubuntu (64-bit)`
   - Memoria RAM: `2048 MB` (mínimo 1024 MB)
   - Disco duro: `Crear uno nuevo` → `VDI` → `Dinámico` → `20 GB`
3. Click "Crear"

### PASO 4: Configurar Red (2 min)

**IMPORTANTE**: Para que Windows pueda conectarse a la VM

1. Selecciona tu VM → "Configuración"
2. "Red" → "Adaptador 1"
3. Conectado a: **"Adaptador puente"** (Bridge)
   - Esto permite acceso desde Windows
4. Click "Aceptar"

### PASO 5: Instalar Ubuntu (10 min)

1. **Iniciar VM**:
   - Selecciona tu VM → "Iniciar"
   - Te pedirá disco de arranque → Selecciona el `.iso` descargado
   
2. **Instalación**:
   - Idioma: `English` (más rápido)
   - Layout teclado: `Spanish` o el tuyo
   - Instalación: `Ubuntu Server` (opción por defecto)
   - Configuración de red: `DHCP` (automático) - **ANOTA LA IP QUE TE DA**
   - Proxy: dejar vacío
   - Mirror: dejar por defecto
   - Disco: `Use entire disk` (usar todo el disco)
   - Storage: confirmar
   
3. **Perfil**:
   - Tu nombre: `admin`
   - Nombre del servidor: `imperial-backend`
   - Usuario: `admin`
   - Contraseña: `admin123` (o la que quieras)
   
4. **SSH**: ✅ IMPORTANTE - Marca `Install OpenSSH server`
5. **Featured snaps**: NO seleccionar nada (más rápido)
6. Espera instalación → "Reboot Now"

7. **Después del reinicio**:
   - Login con tu usuario y contraseña
   - Ya estás en Linux! 🎉

### PASO 6: Configurar Linux (5 min)

```bash
# Actualizar sistema
sudo apt update

# Instalar Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar 10.x.x

# Instalar MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Instalar Git
sudo apt install -y git

# Instalar herramientas útiles
sudo apt install -y curl nano net-tools
```

### PASO 7: Subir tu código a la VM

**Opción A: Usando Git** (RECOMENDADO si tienes repo):
```bash
cd ~
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO/backend
```

**Opción B: Crear archivos manualmente**:
```bash
# Crear carpeta
mkdir -p ~/imperial-backend
cd ~/imperial-backend

# Crear archivos (los crearemos con nano)
nano package.json
# Pega el contenido, Ctrl+O para guardar, Ctrl+X para salir

nano server.js
# Pega el contenido, Ctrl+O, Ctrl+X

nano .env
# Pega el contenido, Ctrl+O, Ctrl+X
```

**Opción C: Compartir carpeta Windows → VM**:
```bash
# En VirtualBox:
# VM → Configuración → Carpetas compartidas → Agregar
# Ruta: C:\arquitectura-software-main\proyecto Arquitectura\backend
# Nombre: backend
# Auto-montar: ✅

# Dentro de Ubuntu:
sudo apt install -y virtualbox-guest-utils
sudo mount -t vboxsf backend ~/imperial-backend
```

### PASO 8: Instalar dependencias (2 min)

```bash
cd ~/imperial-backend
npm install
```

### PASO 9: Obtener IP de la VM

```bash
ip addr show
# O
ifconfig
```

Busca algo como: `inet 192.168.1.XXX` (anota esta IP)

### PASO 10: Iniciar servidor (1 min)

```bash
npm start
```

Deberías ver:
```
✅ MongoDB conectado
✅ Usuario admin creado
🚀 Servidor corriendo en http://localhost:5000
```

### PASO 11: Probar desde Windows

En PowerShell de Windows:
```powershell
curl http://192.168.1.XXX:5000
```

Reemplaza `192.168.1.XXX` con la IP de tu VM.

Si funciona, ves:
```json
{"message":"🚗 Imperial Luxury Cars API",...}
```

---

## 🔥 OPCIÓN 2: WSL2 (Más rápido - 10 minutos)

**Si no quieres VM completa, usa Windows Subsystem for Linux**:

### PASO 1: Instalar WSL2

```powershell
# PowerShell como Administrador
wsl --install -d Ubuntu
```

Reinicia Windows.

### PASO 2: Abrir Ubuntu

1. Busca "Ubuntu" en el menú inicio
2. Configura usuario/contraseña
3. Ya tienes Linux! 🎉

### PASO 3: Instalar todo

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# MongoDB
sudo apt update
sudo apt install -y mongodb
sudo service mongodb start

# Tu proyecto está en:
cd /mnt/c/arquitectura-software-main/proyecto\ Arquitectura/backend
npm install
npm start
```

**Ventaja de WSL2**:
- ✅ Accede a tus archivos de Windows directamente
- ✅ No necesitas transferir archivos
- ✅ IP es localhost (127.0.0.1)
- ✅ Más rápido que VM

---

## 📊 COMPARACIÓN

| Característica | VirtualBox VM | WSL2 | Docker |
|----------------|---------------|------|--------|
| **Tiempo setup** | 45 min | 10 min | 15 min |
| **Es "verdadero" Linux** | ✅ Sí | ⚠️ Casi | ⚠️ Contenedor |
| **Acceso a archivos** | Compartir carpetas | Directo | Volumes |
| **Consumo RAM** | 2GB+ | 500MB | 300MB |
| **IP independiente** | Sí | No (usa Windows) | Mapeo puertos |
| **Lo que espera el profesor** | ✅ Probable | ⚠️ Depende | ⚠️ Depende |

---

## ✅ CHECKLIST ANTES DE PRESENTAR

### Requisitos del profesor:
- [ ] Backend corriendo en Linux (no Windows)
- [ ] Accesible desde tu navegador Windows
- [ ] API RESTful con endpoints funcionales
- [ ] Base de datos (MongoDB en Linux)
- [ ] Frontend conectado a backend Linux

### Para VM:
- [ ] VirtualBox instalado
- [ ] VM Ubuntu creada y corriendo
- [ ] SSH habilitado
- [ ] Red en modo "puente" o "adaptador puente"
- [ ] IP de la VM anotada
- [ ] Node.js instalado en VM
- [ ] MongoDB instalado y corriendo en VM
- [ ] Backend corriendo en VM
- [ ] API accesible desde Windows: `http://IP_VM:5000`

### Para WSL2:
- [ ] WSL2 instalado
- [ ] Ubuntu instalado en WSL
- [ ] Node.js instalado
- [ ] MongoDB corriendo
- [ ] Backend funcionando
- [ ] API accesible: `http://localhost:5000`

---

## 🚨 TROUBLESHOOTING

### "No puedo acceder a la VM desde Windows"

**Problema**: Firewall bloqueando.

**Solución**:
```bash
# En Ubuntu VM:
sudo ufw allow 5000
sudo ufw enable
```

### "MongoDB no inicia"

**Solución**:
```bash
sudo systemctl status mongodb
sudo systemctl start mongodb
sudo journalctl -u mongodb  # Ver logs
```

### "npm install falla"

**Solución**:
```bash
# Limpiar caché
npm cache clean --force
npm install
```

### "No encuentro la IP de la VM"

**Solución**:
```bash
# Método 1
ip addr show | grep inet

# Método 2
hostname -I

# Método 3 (instalar net-tools si no tienes)
sudo apt install net-tools
ifconfig
```

---

## 🎯 RECOMENDACIÓN FINAL

**Para menos de 1 hora**: Usa **WSL2** (más rápido, menos problemas)

**Si el profesor EXIGE VM real**: Usa **VirtualBox** (la opción 1 completa)

**Si tienes cuenta GitHub**: Sube tu código y usa **git clone** en la VM

---

## 📞 PRÓXIMOS PASOS

Una vez que tengas Linux funcionando:

1. ✅ **Te crearé el backend Node.js completo** (server.js, package.json, etc.)
2. ✅ **Adaptaré el frontend** para conectarse a la IP de tu VM
3. ✅ **Te daré comandos para iniciar todo** automáticamente

**¿Qué decides: VirtualBox VM (45 min) o WSL2 (10 min)?**
