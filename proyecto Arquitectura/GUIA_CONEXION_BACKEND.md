# 🚀 Guía de Conexión Frontend ↔️ Backend Linux

## ✅ Migración Completada

Tu aplicación ha sido **completamente migrada** de Firebase a un backend REST API en Linux.

---

## 📋 Cambios Realizados

### 🔧 **Archivos Modificados**

#### Frontend (Windows - Carpeta `public/`)
- ✅ **login.html** - Ahora usa `API.auth.login()` en lugar de Firebase Auth
- ✅ **register.html** - Ahora usa `API.auth.register()` en lugar de Firebase Auth
- ✅ **index.html** - Ahora usa `API.cars.getAll()` en lugar de Firestore
- ✅ **admin.html** - Ahora usa `API.cars.*` y `API.stats.get()` en lugar de Firestore
- ✅ **my-ads.html** - Ahora usa `API.cars.getMy()` en lugar de Firestore
- ✅ **contact.html** - Ahora usa `API.contact.send()` en lugar de Firestore

#### Nuevos Archivos JavaScript
- ✅ **js/api-config.js** (NUEVO) - Cliente REST API + Helpers de autenticación
  - `API_CONFIG.BASE_URL`: http://192.168.1.39:5000/api
  - `API.auth.*`: Login, register, verify
  - `API.cars.*`: CRUD completo de vehículos
  - `API.contact.send()`: Envío de mensajes
  - `requireAuth()`, `requireAdmin()`: Validación JWT
  - `CLOUDINARY_CONFIG`: Mantiene Cloudinary para uploads

- ✅ **js/auth.js** (REESCRITO) - Gestión de autenticación con localStorage
  - Eliminado: `auth.onAuthStateChanged()` de Firebase
  - Nuevo: `initAuth()` con validación de token JWT en localStorage

- ✅ **js/admin.js** (REESCRITO) - Panel admin con REST API
- ✅ **js/my-ads.js** (REESCRITO) - Mis anuncios con REST API

#### Backend (Linux VM - `~/imperial-backend/`)
- ✅ **server.js** - Backend Express.js corriendo en puerto 5000
- ✅ **MongoDB** - Base de datos local (imperial-luxury)
- ✅ **IP VM**: `192.168.1.39`

---

## 🌐 Cómo Probar la Aplicación

### **Paso 1: Verificar que el Backend esté Corriendo**

Desde Windows PowerShell:

```powershell
# Conectar a la VM por SSH
ssh komodo64@192.168.1.39

# Una vez dentro del servidor Linux, ve a la carpeta del backend
cd ~/imperial-backend

# Iniciar el servidor (si no está corriendo)
node server.js
```

**Deberías ver:**
```
🚀 Servidor corriendo en http://0.0.0.0:5000
✅ MongoDB conectado
✅ Admin creado: admin@imperialluxury.com
```

> **IMPORTANTE**: Mantén esta terminal abierta mientras usas la aplicación.

---

### **Paso 2: Servir el Frontend**

Abre **OTRA PowerShell** (Windows):

```powershell
# Navegar a la carpeta del frontend
cd "c:\arquitectura-software-main\proyecto Arquitectura\public"

# Iniciar servidor HTTP local con Python
python -m http.server 8080
```

**Alternativa si no tienes Python:**
```powershell
# Con Node.js (si tienes npx instalado)
npx http-server -p 8080
```

> **Servidor frontend corriendo en:** http://localhost:8080

---

### **Paso 3: Abrir la Aplicación**

Abre tu navegador y ve a:

👉 **http://localhost:8080**

---

## 🔐 Credenciales de Prueba

### **Cuenta Admin** (Pre-creada automáticamente)
- **Email**: `admin@imperialluxury.com`
- **Contraseña**: `admin123`
- **Acceso**: Panel de administración completo

### **Cuenta de Usuario** (Regístrate manualmente)
1. Ve a **Register** en la página
2. Crea tu cuenta de usuario normal
3. Podrás publicar vehículos y gestionar tus propios anuncios

---

## 🧪 Pruebas Completas

### ✅ **1. Prueba de Registro**
1. Ve a http://localhost:8080/register.html
2. Crea una nueva cuenta con email y contraseña
3. Deberías ser redirigido a `index.html` automáticamente
4. ✅ **Verifica**: Usuario guardado en MongoDB

### ✅ **2. Prueba de Login**
1. Ve a http://localhost:8080/login.html
2. Ingresa con `admin@imperialluxury.com` / `admin123`
3. Deberías ver opciones de **Admin Panel** en la navegación
4. ✅ **Verifica**: Token JWT guardado en localStorage

### ✅ **3. Crear un Vehículo (Usuario Normal)**
1. Login como usuario normal
2. Ve a **Mis Anuncios**
3. Click en **➕ Publicar Vehículo**
4. Sube imagen con Cloudinary
5. Rellena todos los datos
6. **Guardar**
7. ✅ **Verifica**: Vehículo aparece en catálogo principal

### ✅ **4. Panel Admin**
1. Login como admin (`admin@imperialluxury.com`)
2. Ve a **Admin Panel**
3. Verifica estadísticas:
   - Total de vehículos
   - Vehículos disponibles
   - Mensajes de contacto pendientes
4. Crea/Edita/Elimina vehículos
5. ✅ **Verifica**: Admin puede editar vehículos de otros usuarios

### ✅ **5. Formulario de Contacto**
1. Ve a http://localhost:8080/contact.html
2. O haz click en **Contactar** en un vehículo disponible
3. Rellena el formulario
4. Enviar
5. ✅ **Verifica**: Mensaje guardado en MongoDB (colección `contactMessages`)

---

## 📊 Endpoints de la API (Backend)

### **Base URL**: `http://192.168.1.39:5000/api`

#### **Autenticación** (`/api/auth/*`)
- `POST /api/auth/register` - Crear usuario (body: email, password)
- `POST /api/auth/login` - Login (body: email, password) → Retorna JWT token
- `GET /api/auth/verify` - Verificar token válido (header: Authorization)

#### **Vehículos** (`/api/cars/*`)
- `GET /api/cars` - Obtener todos los vehículos (límite 50)
- `GET /api/cars/my` - Obtener mis vehículos (requiere auth)
- `GET /api/cars/:id` - Obtener un vehículo específico
- `POST /api/cars` - Crear vehículo (requiere auth)
- `PUT /api/cars/:id` - Actualizar vehículo (requiere auth, solo owner o admin)
- `DELETE /api/cars/:id` - Eliminar vehículo (requiere auth, solo owner o admin)

#### **Contacto** (`/api/contact`)
- `POST /api/contact` - Enviar mensaje de contacto (público)

#### **Estadísticas** (`/api/stats` - SOLO ADMIN)
- `GET /api/stats` - Obtener estadísticas (totalCars, availableCars, pendingMessages)

---

## 🔍 Debugging

### **Si la API no responde:**

1. **Verificar que el backend esté corriendo:**
   ```powershell
   ssh komodo64@192.168.1.39
   cd ~/imperial-backend
   node server.js
   ```

2. **Probar el backend directamente desde Windows:**
   ```powershell
   curl http://192.168.1.39:5000
   ```
   
   **Respuesta esperada:**
   ```json
   {"message":"Imperial Luxury Cars API - Backend Linux","status":"online"}
   ```

3. **Si obtienes error de red:**
   - Verifica que la VM esté encendida
   - Verifica que la IP no haya cambiado (puede cambiar si usas DHCP)
   - Ejecuta `ip addr show` en la VM para ver la IP actual

---

### **Si el frontend muestra errores:**

1. **Abre el DevTools del navegador:**
   - Presiona `F12`
   - Ve a la pestaña **Console**
   - Ve a la pestaña **Network** para ver las peticiones HTTP

2. **Errores comunes:**
   - ❌ **CORS Error**: Ya está solucionado (server.js tiene `cors()` habilitado)
   - ❌ **401 Unauthorized**: Token JWT inválido o expirado → Vuelve a hacer login
   - ❌ **Network Error**: Backend no está corriendo o IP incorrecta

3. **Verificar datos en localStorage:**
   - DevTools → Application → Local Storage → http://localhost:8080
   - Debe haber: `auth_token`, `user_data`

---

### **Si necesitas cambiar la IP del backend:**

Si la IP de tu VM cambia (por ejemplo, de `192.168.1.39` a `192.168.1.50`):

1. Edita el archivo `public/js/api-config.js`:
   ```javascript
   const API_CONFIG = {
       BASE_URL: 'http://192.168.1.50:5000/api',  // Nueva IP aquí
       // ...
   };
   ```

2. Guarda el archivo
3. Recarga la página en el navegador (Ctrl+F5)

---

## 🛑 Para Detener Todo

### **Detener Frontend:**
- En la PowerShell donde corre `python -m http.server`:
  - Presiona `Ctrl + C`

### **Detener Backend:**
- En la terminal SSH del servidor Linux:
  - Presiona `Ctrl + C`

---

## 📝 Archivos Obsoletos (Ya no se usan)

Los siguientes archivos **NO** se eliminaron pero **ya no se usan**:

- ❌ `js/config.js` - Reemplazado por `api-config.js`
- ❌ Firebase SDK scripts en los HTML (ya removidos)

Puedes eliminarlos si quieres limpiar el proyecto:

```powershell
rm "c:\arquitectura-software-main\proyecto Arquitectura\public\js\config.js"
```

---

## 🎉 Resumen

### ✅ **Migración Exitosa**
- ✅ Frontend adaptado a REST API
- ✅ Backend Linux corriendo en VM
- ✅ MongoDB conectado
- ✅ Autenticación JWT funcionando
- ✅ Cloudinary para imágenes (sin cambios)
- ✅ Todas las protecciones de seguridad activas

### 📦 **Stack Final**
- **Frontend**: HTML + CSS + JavaScript puro (Vanilla JS)
- **Backend**: Node.js + Express.js (Linux VM)
- **Base de Datos**: MongoDB 6.0 (Local en VM)
- **Autenticación**: JWT (JSON Web Tokens)
- **Imágenes**: Cloudinary (Cliente)
- **Servidor**: Ubuntu Server 22.04 LTS

---

## 📞 Próximos Pasos (Opcional)

### 1. **Configurar IP Estática en la VM**
Para evitar que la IP cambie:
```bash
# En la VM Linux
sudo nano /etc/netplan/01-netcfg.yaml
```

### 2. **Usar systemd para que el backend se inicie automáticamente**
```bash
sudo nano /etc/systemd/system/imperial-backend.service
```

### 3. **Desplegar el frontend en un hosting estático**
- Netlify
- Vercel
- GitHub Pages

### 4. **Obtener dominio y configurar DNS**
- imperial-luxury.com → Tu VM IP

---

## ✅ ¡Listo!

Tu aplicación está completamente funcional con backend Linux.

**Para probar ahora mismo:**

1. ✅ SSH a la VM → `node server.js` en `~/imperial-backend`
2. ✅ Windows PowerShell → `python -m http.server 8080` en `public/`
3. ✅ Abrir navegador → http://localhost:8080
4. ✅ Login como admin → `admin@imperialluxury.com` / `admin123`

**¡Felicidades! 🎊**
