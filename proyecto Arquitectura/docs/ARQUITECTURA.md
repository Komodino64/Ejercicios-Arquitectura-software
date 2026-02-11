# 🏗️ ARQUITECTURA - Imperial Luxury Cars

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIOS                              │
│                   (Navegador Web)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    FRONTEND                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Nginx (Puerto 8080)                                 │   │
│  │  - HTML5 / CSS3 / JavaScript Vanilla                │   │
│  │  - Responsive Design                                 │   │
│  │  - SPA-like Experience                              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (JSON)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    BACKEND                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js + Express (Puerto 5000)                    │   │
│  │  - API RESTful                                       │   │
│  │  - JWT Authentication                                │   │
│  │  - Mongoose ODM                                      │   │
│  │  - CORS habilitado                                   │   │
│  │  - Middleware de autenticación                       │   │
│  └──────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │ MongoDB Protocol
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                BASE DE DATOS                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MongoDB 6.0 (Puerto 27017)                         │   │
│  │  - Colecciones: users, cars, contactMessages       │   │
│  │  - Índices optimizados                              │   │
│  │  - Datos persistentes (Volume)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

          ┌─────────────────────────────────────┐
          │      SERVICIOS EXTERNOS             │
          │  ┌───────────────────────────────┐  │
          │  │  Cloudinary CDN               │  │
          │  │  - Upload de imágenes         │  │
          │  │  - Transformación automática  │  │
          │  │  - Optimización WebP          │  │
          │  └───────────────────────────────┘  │
          └─────────────────────────────────────┘
```

---

## 🐳 Arquitectura Docker

```
docker-compose.yml
├── Service: frontend (Nginx)
│   ├── Image: nginx:alpine
│   ├── Port: 8080:80
│   ├── Volume: ./public → /usr/share/nginx/html
│   └── Depends: backend
│
├── Service: backend (Node.js)
│   ├── Build: Dockerfile
│   ├── Port: 5000:5000
│   ├── Environment:
│   │   ├── MONGODB_URI
│   │   ├── JWT_SECRET
│   │   └── PORT
│   └── Depends: mongodb
│
└── Service: mongodb (MongoDB)
    ├── Image: mongo:6.0
    ├── Port: 27017:27017
    ├── Volume: mongodb_data:/data/db
    └── Health Check: mongosh ping
```

---

## 📡 Endpoints API

### Autenticación
```
POST /api/auth/register    → Registrar usuario
POST /api/auth/login       → Login (retorna JWT)
GET  /api/auth/verify      → Verificar token
```

### Vehículos (CRUD)
```
GET    /api/cars           → Listar todos (max 50)
GET    /api/cars/my        → Mis anuncios (requiere auth)
GET    /api/cars/:id       → Ver detalle
POST   /api/cars           → Crear (requiere auth)
PUT    /api/cars/:id       → Actualizar (owner/admin)
DELETE /api/cars/:id       → Eliminar (owner/admin)
```

### Contacto
```
POST /api/contact          → Enviar mensaje
```

### Administración
```
GET /api/stats             → Estadísticas (admin)
```

---

## 🔑 Modelo de Datos

### User (users)
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt hash),
  role: String (enum: 'user' | 'admin'),
  createdAt: Date
}
```

### Car (cars)
```javascript
{
  _id: ObjectId,
  brand: String,
  model: String,
  year: Number,
  price: Number,
  description: String,
  imageUrl: String (Cloudinary URL),
  status: String (enum: 'Disponible' | 'Vendido' | 'Reservado'),
  ownerId: ObjectId (ref: User),
  ownerEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ContactMessage (contactMessages)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  message: String,
  carId: ObjectId? (ref: Car, optional),
  status: String (enum: 'pending' | 'attended'),
  createdAt: Date
}
```

---

## 🔐 Seguridad Implementada

### Backend
- ✅ Passwords hasheados con bcryptjs (10 rounds)
- ✅ JWT tokens con expiración (7 días)
- ✅ Middleware de autenticación en rutas protegidas
- ✅ Validación de ownership (users solo pueden editar sus anuncios)
- ✅ Role-based access control (admin puede todo)
- ✅ CORS configurado
- ✅ Headers de seguridad

### Frontend
- ✅ Tokens guardados en localStorage
- ✅ Auto-logout si token inválido
- ✅ Protección anti-DevTools (protection.js)
- ✅ Deshabilitado click derecho
- ✅ Deshabilitado selección de texto
- ✅ CSS anti-copy (protection.css)

---

## 🚀 Flujo de Autenticación

```
1. Usuario → POST /api/auth/login
2. Backend verifica email/password (bcrypt)
3. Backend genera JWT token
4. Frontend guarda token en localStorage
5. Cada request: Header "Authorization: Bearer <token>"
6. Middleware verifica token
7. Si válido → procesa request
8. Si inválido → 401 Unauthorized
```

---

## 📦 Stack Tecnológico

### Frontend
- HTML5 / CSS3
- JavaScript Vanilla (ES6+)
- Cloudinary Upload Widget
- LocalStorage API

### Backend
- Node.js 20.x
- Express.js 4.18
- Mongoose 7.6 (MongoDB ODM)
- JWT (jsonwebtoken 9.0)
- bcryptjs 2.4
- cors 2.8
- dotenv 16.3

### Base de Datos
- MongoDB 6.0
- Índices en `email`, `ownerId`, `createdAt`

### DevOps
- Docker 24+
- Docker Compose v3.8
- Nginx Alpine
- Node Alpine

---

## 🎯 Características Principales

### Para Usuarios
- ✅ Registro/Login
- ✅ Ver catálogo de vehículos
- ✅ Publicar anuncios propios
- ✅ Editar/eliminar propios anuncios
- ✅ Enviar mensajes de contacto
- ✅ Upload de imágenes vía Cloudinary

### Para Administradores
- ✅ Dashboard con estadísticas
- ✅ Ver todos los vehículos
- ✅ Editar cualquier anuncio
- ✅ Eliminar cualquier anuncio
- ✅ Ver mensajes de contacto

---

## ⚡ Optimizaciones

### Performance
- Límite de 50 vehículos por query (paginación futura)
- Imágenes optimizadas con Cloudinary (WebP, lazy loading)
- Índices en MongoDB para búsquedas rápidas
- Nginx con gzip compression
- Cache headers configurados

### Escalabilidad
- Arquitectura stateless (JWT)
- Backend puede escalar horizontalmente
- MongoDB replica sets ready
- CORS permite múltiples frontends
- Docker permite despliegue en cualquier cloud

---

## 🌐 Deployment Options

### Opción 1: Docker Compose (Local/VPS)
```bash
docker compose up -d
```

### Opción 2: Cloud Platforms
- **DigitalOcean**: App Platform + Managed MongoDB
- **AWS**: ECS + DocumentDB
- **Heroku**: Web Dyno + MongoDB Atlas
- **Azure**: App Service + Cosmos DB

### Opción 3: Kubernetes
- Deployment manifests disponibles
- ConfigMaps para configuración
- Secrets para credenciales
- Persistent Volumes para MongoDB

---

## 📊 Health Checks

```bash
# Frontend
curl http://localhost:8080/

# Backend
curl http://localhost:5000/

# MongoDB (desde el contenedor)
docker exec mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 🔄 CI/CD Ready

```yaml
# Ejemplo GitHub Actions
- Build Docker images
- Run tests
- Push to registry
- Deploy to production
- Health check
- Rollback if needed
```

---

**Arquitectura diseñada para: Escalabilidad, Mantenibilidad, Seguridad y Performance**
