# 🚀 OPTIMIZACIONES PARA PRUEBAS DE ESTRÉS

## ⚡ Configuración Actual vs Optimizada

### Firebase Firestore
**Problema**: Consultas sin límites pueden saturar la conexión.

```javascript
// ❌ ANTES (sin optimizar)
db.collection('cars').get()

// ✅ DESPUÉS (optimizado)
db.collection('cars')
  .orderBy('createdAt', 'desc')
  .limit(20) // Paginación
  .get()
```

### Cloudinary
**Problema**: Imágenes grandes ralentizan la carga.

```html
<!-- ❌ ANTES -->
<img src="https://res.cloudinary.com/dkdoh6z8u/image/upload/v123/car.jpg">

<!-- ✅ DESPUÉS (con transformaciones automáticas) -->
<img src="https://res.cloudinary.com/dkdoh6z8u/image/upload/w_800,q_auto,f_auto/v123/car.jpg">
```

---

## 🔧 IMPLEMENTACIÓN DE OPTIMIZACIONES

### 1️⃣ Indexar Firestore (CRÍTICO)

Ve a: **Firebase Console → Firestore Database → Indexes**

Crea estos índices compuestos:

| Colección | Campos | Orden |
|-----------|--------|-------|
| `cars` | `createdAt` | Descendente |
| `cars` | `status` + `createdAt` | Ascendente + Descendente |
| `cars` | `ownerId` + `createdAt` | Ascendente + Descendente |

### 2️⃣ Reglas de Caché en Firebase Hosting

Edita `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=604800, must-revalidate"
          }
        ]
      },
      {
        "source": "**/*.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=300"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3️⃣ Lazy Loading de Imágenes

Ya implementado en `index.html`:

```html
<img loading="lazy" src="..." alt="...">
```

### 4️⃣ Limitar Consultas en Tiempo Real

**Actualizar `index.html`** (línea ~97):

```javascript
// Limitar a 50 carros máximo
db.collection('cars')
  .where('status', '==', 'disponible')
  .orderBy('createdAt', 'desc')
  .limit(50)
  .onSnapshot(snapshot => {
    // ... código existente
  });
```

### 5️⃣ Debouncing para Búsquedas

Si agregas búsqueda en tiempo real:

```javascript
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(e.target.value);
  }, 500); // Espera 500ms después de que el usuario deje de escribir
});
```

---

## 📊 MONITOREO DE RENDIMIENTO

### Firebase Performance Monitoring

Agrega al `<head>` de todas las páginas:

```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-performance-compat.js"></script>
```

En `config.js`:

```javascript
const perf = firebase.performance();
```

---

## 🛡️ LÍMITES DE TASA (Rate Limiting)

**Actualizar `firestore.rules`** para prevenir spam:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función para limitar creaciones (máximo 10 por hora)
    function rateLimitCreate() {
      return request.time > resource.data.lastCreate + duration.value(1, 'h')
             || !('lastCreate' in resource.data);
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isAdmin();
      
      // Trackear última creación
      match /rateLimits/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    match /cars/{carId} {
      allow read: if true;
      allow create: if isAuthenticated(); // Ya lo tienes
      allow update, delete: if isAdmin() || resource.data.ownerId == request.auth.uid;
    }
    
    match /contactMessages/{messageId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth != null && request.auth.uid == 'KZHNi0Nft1OH8FsLDEx8OrkGTHn1';
    }
  }
}
```

---

## 🚦 RESULTADOS ESPERADOS

| Métrica | Antes | Después |
|---------|-------|---------|
| Tiempo de carga inicial | ~3-5s | **<1.5s** |
| Imágenes optimizadas | No | **Sí (Cloudinary auto)** |
| Consultas Firestore/día | Ilimitadas | **<10,000** |
| Ancho de banda | Alto | **Reducido 70%** |
| Protección DDoS | Básica | **Firebase + Rate Limiting** |

---

## ✅ CHECKLIST ANTES DE PRUEBA DE ESTRÉS

- [ ] Índices Firestore creados
- [ ] `firebase.json` actualizado con headers de caché
- [ ] Límite de 50 carros en queries
- [ ] Cloudinary configurado con transformaciones automáticas
- [ ] Firebase Performance Monitoring habilitado
- [ ] Rate limiting en reglas Firestore
- [ ] Lazy loading en todas las imágenes
- [ ] Plan Blaze de Firebase (si esperas >50k lecturas/día)

---

## 🔥 COMANDOS PARA PRUEBA DE ESTRÉS LOCAL

```bash
# Instalar Apache Bench (viene con Apache)
# Windows: Descargar Apache binarios

# Prueba simple (100 requests, 10 concurrentes)
ab -n 100 -c 10 https://imperial-luxury-5b48a.web.app/

# Prueba intensiva (1000 requests, 50 concurrentes)
ab -n 1000 -c 50 https://imperial-luxury-5b48a.web.app/

# Con headers
ab -n 500 -c 25 -H "Accept-Encoding: gzip" https://imperial-luxury-5b48a.web.app/
```

---

## 📞 NOTAS ADICIONALES

1. **Firebase Plan**: 
   - Spark (gratis): 50k lecturas/día
   - Si la prueba supera esto, actualiza a **Blaze** (pay-as-you-go)

2. **Cloudinary**:
   - Plan Free: 25 créditos/mes (25k transformaciones)
   - Optimización automática con `q_auto,f_auto`

3. **CDN de Firebase**:
   - Firebase Hosting usa Fastly CDN automáticamente
   - Caché global, no necesitas configurar nada extra
