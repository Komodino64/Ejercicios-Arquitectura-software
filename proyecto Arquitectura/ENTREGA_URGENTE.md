# 🚗 Imperial Luxury Cars - Guía de Despliegue Urgente

## ⚡ OPCIÓN 1: Docker (RECOMENDADO - 15 minutos)

### ¿Tenés Docker instalado?
```powershell
docker --version
```

Si dice "no se reconoce", seguí → [INSTALAR_DOCKER.md](INSTALAR_DOCKER.md)

### Si ya tenés Docker:
```powershell
# 1. Construir
docker compose build

# 2. Iniciar
docker compose up -d

# 3. Verificar
docker compose ps
```

**Listo**: http://localhost:8080 (Frontend) + http://localhost:5000 (API)

---

## ⚡ OPCIÓN 2: Manual (Sin Docker - 5 minutos)

### Backend (Terminal Linux VM):
```bash
ssh komodo64@192.168.1.39
cd ~/imperial-backend
node server.js
```

### Frontend (Terminal Windows):
```powershell
cd "c:\arquitectura-software-main\proyecto Arquitectura\public"
python -m http.server 8080
```

**Listo**: http://localhost:8080

---

## 📋 Checklist de Entrega

- [x] Backend Node.js + Express funcionando
- [x] MongoDB configurado
- [x] Frontend HTML/CSS/JS adaptado
- [x] Cloudinary para imágenes
- [x] Autenticación JWT
- [x] CRUD completo de vehículos
- [x] Panel administrador
- [x] Docker Compose configurado
- [x] Nginx para frontend
- [x] Health checks en contenedores
- [x] Variables de entorno separadas
- [x] Documentación completa

---

## 🎯 Para la Demostración

### 1. Inicio rápido
```powershell
# Con Docker
docker compose up -d

# O manual
.\iniciar.bat
```

### 2. Mostrar arquitectura
- **Frontend**: Nginx (puerto 8080)
- **Backend**: Node.js + Express (puerto 5000)
- **Base de datos**: MongoDB (puerto 27017)
- **Imágenes**: Cloudinary (CDN externo)

### 3. Funcionalidades
✅ Registro de usuarios
✅ Login con JWT
✅ Catálogo de vehículos
✅ Crear/editar/eliminar anuncios
✅ Panel de administrador
✅ Formulario de contacto
✅ Upload de imágenes

### 4. Credenciales Admin
```
Email: admin@imperialluxury.com
Password: admin123
```

### 5. Comandos para mostrar
```powershell
# Ver servicios activos
docker compose ps

# Ver logs en tiempo real
docker compose logs -f backend

# Ver estadísticas
docker stats

# Acceder a base de datos
docker compose exec mongodb mongosh imperial-luxury
```

---

## 📦 Archivos de Entrega

```
proyecto-arquitectura/
├── docker-compose.yml          ← Orquestación Docker
├── Dockerfile                  ← Imagen backend
├── nginx.conf                  ← Config servidor web
├── .dockerignore              ← Excluir archivos
├── backend/
│   ├── server.js              ← API REST completa
│   ├── package.json           ← Dependencias
│   └── .env                   ← Variables entorno
├── public/
│   ├── *.html                 ← Páginas frontend
│   ├── css/                   ← Estilos
│   └── js/
│       ├── api-config.js      ← Cliente API
│       ├── auth.js            ← Autenticación
│       ├── admin.js           ← Panel admin
│       └── *.js               ← Lógica negocio
└── DOCKER_README.md           ← Documentación
```

---

## 🐛 Solución Rápida de Problemas

### "Cannot connect to backend"
```powershell
# Verificar que backend esté corriendo
curl http://localhost:5000

# Si no responde, iniciarlo
docker compose restart backend
```

### "MongoDB connection failed"
```powershell
# Verificar MongoDB
docker compose logs mongodb

# Reiniciar
docker compose restart mongodb
```

### "Puerto ya en uso"
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :8080

# Matar proceso (reemplazar PID)
taskkill /PID <número> /F
```

---

## ⏱️ Timeline de Despliegue

| Método | Tiempo | Complejidad |
|--------|--------|-------------|
| Docker (ya instalado) | 3-5 min | Baja |
| Instalar Docker + Deploy | 15-20 min | Media |
| Manual (método actual) | 2 min | Muy Baja |

---

## 💡 Recomendación

**Si tenés menos de 20 minutos**:
→ Usar método manual (ya funciona)
→ Mencionar "Docker está configurado pero usamos método directo por timing"

**Si tenés más de 20 minutos**:
→ Instalar Docker Desktop
→ Ejecutar `docker compose up -d`
→ Demostrar arquitectura containerizada

---

## 📞 Comandos de Emergencia

```powershell
# Todo se rompió - Reset completo
docker compose down -v
docker compose build --no-cache
docker compose up -d

# O volver al método manual
cd "c:\arquitectura-software-main\proyecto Arquitectura\public"
python -m http.server 8080
```

---

**✅ Tu proyecto está listo para entregar con o sin Docker**
