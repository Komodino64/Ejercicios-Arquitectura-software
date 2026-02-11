# 🐳 DOCKER - Imperial Luxury Cars

## 📦 Requisitos
- Docker Desktop instalado
- Docker Compose v3.8+

## 🚀 Inicio Rápido

### 1️⃣ Construir las imágenes
```bash
docker-compose build
```

### 2️⃣ Iniciar todos los servicios
```bash
docker-compose up -d
```

### 3️⃣ Verificar estado
```bash
docker-compose ps
```

### 4️⃣ Acceder a la aplicación
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 👤 Credenciales Admin
- **Email**: admin@imperialluxury.com
- **Password**: admin123

## 📋 Servicios Incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **frontend** | 8080 | Nginx sirviendo HTML/CSS/JS |
| **backend** | 5000 | API REST Node.js + Express |
| **mongodb** | 27017 | Base de datos MongoDB 6.0 |

## 🛠️ Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (ELIMINA LA BD)
docker-compose down -v

# Reiniciar un servicio
docker-compose restart backend

# Ejecutar comando en contenedor
docker-compose exec backend sh
docker-compose exec mongodb mongosh imperial-luxury

# Ver uso de recursos
docker stats
```

## 🔧 Configuración

### Variables de Entorno (Backend)
Editar en `docker-compose.yml`:
```yaml
environment:
  PORT: 5000
  MONGODB_URI: mongodb://mongodb:27017/imperial-luxury
  JWT_SECRET: tu_secreto_aqui
  ADMIN_EMAIL: admin@imperialluxury.com
  ADMIN_PASSWORD: admin123
```

### Cambiar Puertos
Editar en `docker-compose.yml`:
```yaml
ports:
  - "TU_PUERTO:80"    # Frontend
  - "TU_PUERTO:5000"  # Backend
```

## 🗄️ Persistencia de Datos

Los datos de MongoDB se guardan en un volumen Docker:
```bash
# Backup manual
docker-compose exec mongodb mongodump --out=/data/backup

# Listar volúmenes
docker volume ls

# Ver información del volumen
docker volume inspect proyecto-arquitectura_mongodb_data
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
```bash
# Verificar que backend esté corriendo
docker-compose ps backend

# Ver logs del backend
docker-compose logs backend

# Reiniciar backend
docker-compose restart backend
```

### "MongoDB connection failed"
```bash
# Verificar MongoDB
docker-compose ps mongodb

# Ver logs de MongoDB
docker-compose logs mongodb

# Entrar a MongoDB
docker-compose exec mongodb mongosh imperial-luxury
```

### Frontend no carga
```bash
# Verificar Nginx
docker-compose logs frontend

# Reiniciar frontend
docker-compose restart frontend
```

## 📦 Para Producción

### Opción 1: Desplegar en VPS/Cloud
1. Copiar todos los archivos al servidor
2. Cambiar `BASE_URL` en `public/js/api-config.js` a tu dominio
3. Ejecutar `docker-compose up -d`

### Opción 2: Docker Hub
```bash
# Construir imagen
docker build -t tuusuario/imperial-backend:latest .

# Subir a Docker Hub
docker push tuusuario/imperial-backend:latest
```

### Opción 3: Exportar/Importar
```bash
# Exportar imagen
docker save -o imperial-backend.tar imperial-backend

# Importar en otro servidor
docker load -i imperial-backend.tar
```

## 🔐 Seguridad

**IMPORTANTE antes de producción:**
1. Cambiar `JWT_SECRET` por uno seguro
2. Cambiar contraseña de admin
3. Habilitar HTTPS (usar Nginx con Let's Encrypt)
4. Agregar autenticación a MongoDB
5. Configurar firewall

## 📊 Monitoreo

```bash
# Ver recursos en tiempo real
docker stats

# Health checks
curl http://localhost:5000/
curl http://localhost:8080/
```

## 🎯 Para la Entrega

**Archivos a incluir:**
- ✅ `Dockerfile`
- ✅ `docker-compose.yml`
- ✅ `nginx.conf`
- ✅ `.dockerignore`
- ✅ Este README

**Comandos para demostración:**
```bash
# 1. Construir
docker-compose build

# 2. Iniciar
docker-compose up -d

# 3. Verificar servicios funcionando
docker-compose ps

# 4. Mostrar logs
docker-compose logs -f backend

# 5. Acceder a la app
# Abrir navegador en http://localhost:8080
```

---

**💡 Tip**: Si necesitás usar la IP de la VM (192.168.1.39) en lugar de localhost, cambiá `BASE_URL` en `public/js/api-config.js` y los puertos en `docker-compose.yml`.
