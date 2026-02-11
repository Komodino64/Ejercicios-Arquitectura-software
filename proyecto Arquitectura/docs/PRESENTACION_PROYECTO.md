# 🚗 IMPERIAL LUXURY CARS - PRESENTACIÓN PROYECTO
## Arquitectura de Software - Febrero 2026

---

## 📋 ÍNDICE DE LA PRESENTACIÓN

1. [Introducción y Objetivos](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura)
3. [Seguridad Implementada (15 capas)](#3-seguridad)
4. [Tecnologías Utilizadas](#4-tecnologías)
5. [Funcionalidades Principales](#5-funcionalidades)
6. [Demostración en Vivo](#6-demo)
7. [Conclusiones](#7-conclusiones)

---

# 1️⃣ INTRODUCCIÓN

## ¿Qué es Imperial Luxury Cars?

**Plataforma web para venta de vehículos de lujo** desarrollada con arquitectura moderna de 3 capas:
- 🎨 **Frontend**: Interfaz responsiva con HTML5/CSS3/JavaScript Vanilla
- ⚙️ **Backend**: API REST con Node.js + Express + MongoDB
- 🐳 **Deployment**: Dockerizado con 3 contenedores (Frontend, Backend, Database)

## Objetivos del Proyecto

✅ Implementar arquitectura escalable y segura  
✅ Aplicar 15 capas de seguridad en backend y frontend  
✅ Desplegar con Docker para portabilidad  
✅ Gestión completa de vehículos con roles (Admin/Usuario)  
✅ Integración con servicios externos (Cloudinary CDN)  

---

# 2️⃣ ARQUITECTURA DEL SISTEMA

## Diagrama General

```
┌─────────────────────┐
│   USUARIO (Web)     │
│   localhost:8080    │
└──────────┬──────────┘
           │ HTTP/HTTPS
           ▼
┌─────────────────────┐
│  FRONTEND (Nginx)   │◄─── Docker Container 1
│  - HTML/CSS/JS      │
│  - Puerto: 8080     │
└──────────┬──────────┘
           │ REST API (JSON)
           ▼
┌─────────────────────┐
│  BACKEND (Node.js)  │◄─── Docker Container 2
│  - Express + JWT    │
│  - Puerto: 5000     │
│  - 15 CAPAS SEG.   │
└──────────┬──────────┘
           │ MongoDB Protocol
           ▼
┌─────────────────────┐
│  DATABASE (Mongo)   │◄─── Docker Container 3
│  - MongoDB 6.0      │
│  - Puerto: 27017    │
│  - 31 Vehículos     │
└─────────────────────┘

External: Cloudinary (CDN para imágenes)
```

## Componentes Docker

### 🐳 docker-compose.yml (3 servicios)

1. **Frontend** (`imperial-frontend`)
   - Imagen: `nginx:alpine`
   - Puerto: `8080:80`
   - Volumen: `./public` → archivos estáticos
   - Healthcheck: cada 30s

2. **Backend** (`imperial-backend`)
   - Build: `Dockerfile` personalizado
   - Puerto: `5000:5000`
   - Variables: `JWT_SECRET`, `MONGODB_URI`
   - Healthcheck: curl localhost:5000

3. **Database** (`imperial-mongodb`)
   - Imagen: `mongo:6.0`
   - Puerto: `27017:27017`
   - Volumen persistente: `mongodb_data`
   - Healthcheck: mongosh ping

---

# 3️⃣ SEGURIDAD IMPLEMENTADA (15 CAPAS)

## 🛡️ Backend Security Layers (10 capas)

### **Capa 1-2: Helmet.js + Security Headers**
```javascript
app.use(helmet());
```
**Protecciones**:
- ✅ X-Frame-Options: DENY (anti-clickjacking)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security (HSTS)

**Previene**: XSS, clickjacking, MIME sniffing, ataques man-in-the-middle

---

### **Capa 3: Rate Limiting (Anti Brute Force)**
```javascript
// General API: 50 requests / 10 minutos
// Auth endpoints: 3 intentos / 15 minutos
app.use('/api', limiter);
```
**Protecciones**:
- ✅ Bloquea ataques de fuerza bruta
- ✅ Previene enumeración de usuarios
- ✅ Mitiga DDoS a nivel de aplicación

**Ejemplo real**: Si un atacante intenta hacer login 4 veces en 15 min → bloqueado

---

### **Capa 4: CORS Flexible**
```javascript
allowedOrigins: [
  'http://localhost:8080',
  'http://localhost:9999', // Desktop App
  /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3})/ // Red local
]
```
**Protecciones**:
- ✅ Solo orígenes permitidos
- ✅ Soporta red local (192.168.x.x)
- ✅ Soporta app de escritorio (puerto 9999)

---

### **Capa 5-6: Input Validation (Express-Validator)**
```javascript
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
body('price').isFloat({ min: 0 }),
body('year').isInt({ min: 1900, max: 2027 })
```
**Validaciones en cada endpoint**:
- ✅ Email RFC válido + normalizado
- ✅ Password mínimo 6 caracteres con mayúsculas/minúsculas/números
- ✅ Marca/Modelo: máx 50 caracteres
- ✅ Precio: número positivo
- ✅ Año: rango 1900-2027
- ✅ ImageUrl: URL válida
- ✅ Status: solo valores permitidos

**Previene**: SQL/NoSQL injection, XSS, datos corruptos

---

### **Capa 7: NoSQL Injection Protection**
```javascript
app.use(mongoSanitize());
```
**Ejemplo de ataque bloqueado**:
```json
// Intento de bypass login:
{ "email": { "$gt": "" }, "password": { "$gt": "" } }

// Después de sanitización:
{ "email": "", "password": "" }
```

---

### **Capa 8: JWT Authentication (JsonWebToken)**
```javascript
jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' })
```
**Características**:
- ✅ Tokens firmados con secreto de 256 bits
- ✅ Expiración: 7 días
- ✅ Payload: id, email, role
- ✅ Verificación en cada endpoint protegido

---

### **Capa 9: Password Hashing (Bcrypt)**
```javascript
bcrypt.hashSync(password, 12)
```
**Seguridad**:
- ✅ Salt rounds: 12 (4096 iteraciones)
- ✅ Previene rainbow tables
- ✅ Comparación con `bcrypt.compareSync()`

**Ejemplo real**: Password "admin123" → `$2a$12$X8j.../...` (60 caracteres)

---

### **Capa 10: HTTP Logging (Morgan)**
```javascript
app.use(morgan('combined'));
```
**Registro de auditoría**:
```
172.18.0.1 - - [11/Feb/2026:15:48:06] "POST /api/auth/login HTTP/1.1" 200
172.18.0.1 - - [11/Feb/2026:15:48:14] "GET /api/cars HTTP/1.1" 200 15762
```
**Utilidad**: Rastreo de accesos, debugging, análisis forense

---

## 🔒 Frontend Security Layers (5 capas)

### **Capa 11: DevTools Blocking (protection.js)**
```javascript
// Detección de DevTools abierto (3 métodos):
1. Por tamaño de ventana (innerWidth/outerWidth)
2. Trampa debugger con medición de tiempo
3. console.log() hook

// Teclas bloqueadas:
F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S
```
**Resultado**: Si abres F12 → Redirige a página de advertencia

---

### **Capa 12: Eventos de Copia Bloqueados**
```javascript
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
```

---

### **Capa 13: CSS User-Select None**
```css
* {
    user-select: none !important;
    -webkit-user-select: none !important;
}
/* Excepto inputs para usabilidad */
input, textarea { user-select: text; }
```

---

### **Capa 14: Watermark Invisible**
```css
body::after {
    content: "© Imperial Luxury Cars - Copia no autorizada";
    color: rgba(255, 255, 255, 0.02); /* Invisible */
}
```
**Función**: Se hace visible en screenshots (evidencia de copia)

---

### **Capa 15: Console Hijacking**
```javascript
console.log = () => {};
console.warn = () => {};
console.error = () => {};
setInterval(() => console.clear(), 1000); // Limpieza cada 1s
```

---

# 4️⃣ TECNOLOGÍAS UTILIZADAS

## Stack Tecnológico

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo (Flexbox, Grid)
- **JavaScript Vanilla** - Lógica del cliente (sin frameworks)
- **Nginx Alpine** - Servidor web (imagen Docker optimizada)

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express 4.18** - Framework web minimalista
- **MongoDB 6.0** - Base de datos NoSQL
- **Mongoose 8.0** - ODM para MongoDB

### Seguridad
- **Helmet** - Security headers
- **Express-Rate-Limit** - Anti brute force
- **Express-Validator** - Validación de inputs
- **Express-Mongo-Sanitize** - Anti NoSQL injection
- **Bcrypt** - Hashing de passwords (12 rounds)
- **JsonWebToken** - Autenticación JWT

### DevOps
- **Docker 24** - Contenedores
- **Docker Compose** - Orquestación multi-contenedor
- **Git + GitHub** - Control de versiones

### Servicios Externos
- **Cloudinary** - CDN para imágenes (upload widget)

---

# 5️⃣ FUNCIONALIDADES PRINCIPALES

## Para Visitantes (Sin Login)

✅ **Ver Catálogo de Vehículos**
   - 31 vehículos de lujo (Ferrari, Lamborghini, Porsche, etc.)
   - Filtros: precio, marca, estado, año
   - Búsqueda por marca/modelo/descripción
   - Ordenamiento: precio/año/marca

✅ **Contactar Vendedor**
   - Formulario de contacto
   - Mensaje guardado en base de datos

## Para Usuarios Registrados

✅ **Publicar Vehículos**
   - Subir imágenes con Cloudinary Upload Widget
   - Formulario validado (marca, modelo, año, precio, descripción)
   - Gestión de estado: Disponible/Reservado/Vendido

✅ **Mis Anuncios**
   - Ver solo mis publicaciones
   - Editar mis vehículos
   - Eliminar mis vehículos

## Para Administradores

✅ **Panel Admin**
   - Estadísticas del sistema (total vehículos, disponibles, mensajes)
   - Ver TODOS los vehículos (de todos los usuarios)
   - Editar/eliminar cualquier vehículo
   - Gestión de mensajes de contacto

✅ **Credenciales Admin**:
   - Email: `admin@imperialluxury.com`
   - Password: `admin123`

---

# 6️⃣ DEMOSTRACIÓN EN VIVO

## URLs del Sistema

```
Frontend:  http://localhost:8080/
Backend:   http://localhost:5000/api
Database:  mongodb://localhost:27017/imperial-luxury
```

## Flujo de Demostración (10 minutos)

### **1. Mostrar Docker Corriendo** (1 min)
```powershell
docker ps
```
**Explicar**: 3 contenedores (frontend, backend, mongodb) con healthchecks

---

### **2. Catálogo Público** (2 min)
- Abrir: `http://localhost:8080/`
- Mostrar los **31 vehículos** cargados
- Demostrar **filtros**:
  - Buscar "Ferrari"
  - Filtrar por precio < $500,000
  - Ordenar por precio descendente
- Mostrar **tarjetas de vehículos** con imágenes de Cloudinary

---

### **3. Seguridad Frontend** (2 min)
- Intentar **F12** → Bloqueado
- Intentar **Ctrl+Shift+I** → Bloqueado
- Intentar **clic derecho** → Bloqueado
- Intentar **seleccionar texto** → Bloqueado
- Mostrar en código fuente: `protection.js` y `protection.css`

---

### **4. Login de Administrador** (1 min)
- Ir a: `http://localhost:8080/login.html`
- Login con:
  - Email: `admin@imperialluxury.com`
  - Password: `admin123`
- Redirige a panel admin

---

### **5. Panel Admin** (2 min)
- Abrir: `http://localhost:8080/admin.html`
- Mostrar **estadísticas**:
  - Total de Vehículos: 31
  - Disponibles: ~20
  - Mensajes: 0
- Mostrar **tabla de vehículos** con todos los registros
- Clic en "➕ Agregar Vehículo"

---

### **6. Subir Vehículo con Cloudinary** (2 min)
- Clic en "📸 Seleccionar Imagen"
- Se abre **Cloudinary Upload Widget**
- Subir imagen (local o por URL)
- Llenar formulario:
  - Marca: BMW
  - Modelo: M5 Competition
  - Año: 2024
  - Precio: 125000
  - Descripción: Sedán deportivo con motor V8 biturbo
  - Estado: Disponible
- Clic en "💾 Guardar"
- **Imagen se sube a Cloudinary**, URL se guarda en MongoDB
- Vehículo aparece en catálogo

---

# 7️⃣ CONCLUSIONES

## Logros del Proyecto

✅ **Arquitectura Escalable**
   - 3 capas bien definidas (Presentación, Lógica, Datos)
   - Dockerizado para deployment en cualquier servidor
   - Fácil agregar nuevas funcionalidades

✅ **Seguridad Robusta**
   - **15 capas de seguridad** implementadas
   - **10 capas en backend** (Helmet, Rate Limiting, JWT, Bcrypt, etc.)
   - **5 capas en frontend** (DevTools blocking, CSS protection, watermark)
   - Protección contra: XSS, CSRF, SQL/NoSQL injection, brute force, clickjacking

✅ **CRUD Completo**
   - Create: Subir vehículos con imágenes
   - Read: Catálogo con filtros/búsqueda
   - Update: Editar vehículos propios (o todos si eres admin)
   - Delete: Eliminar vehículos propios (o todos si eres admin)

✅ **Autenticación JWT**
   - Login/Register seguros
   - Tokens con expiración (7 días)
   - Roles: Usuario normal vs Admin

✅ **CDN Cloudinary**
   - Upload widget para imágenes
   - Optimización automática WebP
   - URLs permanentes y rápidas

---

## Desafíos Superados

🔧 **Race Condition en Carga de Scripts**
   - **Problema**: `admin.js` se cargaba antes de `api-config.js`
   - **Solución**: Carga secuencial con callbacks (api-config → auth → admin)

🔧 **Objeto Auth Faltante**
   - **Problema**: `Auth.getCurrentUser()` no definido en `auth.js`
   - **Solución**: Agregado objeto `Auth` con métodos `getCurrentUser()`, `isAuthenticated()`, `isAdmin()`

🔧 **CORS con App de Escritorio**
   - **Problema**: Desktop app en puerto 9999 bloqueada por CORS
   - **Solución**: Agregado `localhost:9999` a `allowedOrigins` en backend

🔧 **Protecciones Bloqueando Debugging**
   - **Problema**: Protection.js evitaba abrir DevTools durante desarrollo
   - **Solución**: Agregado check de `localhost` para desactivar protecciones en desarrollo

---

## Métricas Finales

📊 **Código Fuente**:
- **Backend**: 679 líneas (server.js) + 180 líneas (api-config.js)
- **Frontend**: 6 páginas HTML + 6 archivos JS
- **Seguridad**: 158 líneas (protection.js) + 82 líneas (protection.css)
- **Base de Datos**: 31 vehículos (15.7 KB JSON)

🐳 **Docker**:
- 3 contenedores activos
- Healthchecks en los 3 servicios
- Volumen persistente para MongoDB
- Red privada `imperial-network`

🛡️ **Seguridad**:
- 15 capas de protección
- 0 vulnerabilidades críticas (auditado con npm audit)
- Rate limiting: 50 req/10min (general), 3 req/15min (auth)

---

## Próximas Mejoras

🚀 **Futuro del Proyecto**:
- [ ] HTTPS con Let's Encrypt
- [ ] Paginación en catálogo (actualmente muestra 50 max)
- [ ] Panel de mensajes completo en admin
- [ ] Sistema de favoritos para usuarios
- [ ] Notificaciones push cuando vehículo reservado
- [ ] Reportes en PDF (listado de vehículos)
- [ ] Dashboard con gráficas (D3.js o Chart.js)
- [ ] Modo oscuro (dark mode)
- [ ] PWA (Progressive Web App)
- [ ] Tests unitarios (Jest) + E2E (Cypress)

---

## 🎤 FIN DE LA PRESENTACIÓN

**Preguntas Frecuentes Preparadas**:

❓ **¿Por qué no usaron un framework frontend (React/Vue)?**  
→ JavaScript Vanilla demuestra conocimiento de fundamentos. Los frameworks abstraen mucho.

❓ **¿Por qué MongoDB y no SQL?**  
→ Flexibilidad de schema para proyectos en evolución. NoSQL es ideal para documentos JSON.

❓ **¿Cómo manejan las imágenes?**  
→ Cloudinary CDN con upload widget. No guardamos imágenes en servidor (optimización).

❓ **¿Funcionaría en producción real?**  
→ Sí, solo falta HTTPS (Let's Encrypt) y servidor cloud (AWS/Azure/DigitalOcean).

❓ **¿Cuánto tiempo tomó el proyecto?**  
→ [Menciona la duración real: "3 semanas" o lo que sea]

❓ **¿Qué herramienta usaron para diseñar?**  
→ CSS puro con Flexbox/Grid. Diseño responsivo con media queries.

---

## 📞 DATOS DE CONTACTO DEL EQUIPO

[Agrega aquí los nombres y contactos de tu equipo]

**GitHub del Proyecto**: https://github.com/Komodino64/Ejercicios-Arquitectura-software

---

**¡Gracias por su atención!** 👨‍💻👩‍💻

