# 🚀 GUÍA COMPLETA DE DEPLOYMENT A FIREBASE HOSTING

## 📋 PRE-REQUISITOS

- [x] Node.js instalado (verificar con `node --version`)
- [x] Firebase CLI instalado (pendiente)
- [x] Proyecto Firebase creado: `imperial-luxury-5b48a`
- [x] Código listo en carpeta `public/`

---

## 🔥 PASO 1: INSTALAR FIREBASE CLI

### Solución al Error de PowerShell

Si te sale el error: `"la ejecución de scripts está deshabilitada"`, ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego instala Firebase CLI:

```powershell
npm install -g firebase-tools
```

Verifica la instalación:

```powershell
firebase --version
```

---

## 🔐 PASO 2: AUTENTICACIÓN

```powershell
firebase login
```

Se abrirá tu navegador. Inicia sesión con la cuenta de Google que usaste para crear el proyecto Firebase.

---

## 🎯 PASO 3: INICIALIZAR HOSTING

Navega a tu carpeta del proyecto:

```powershell
cd "c:\arquitectura-software-main\proyecto Arquitectura"
```

Inicia el asistente de Firebase:

```powershell
firebase init hosting
```

Responde a las preguntas:

1. **"Please select an option"**: `Use an existing project`
2. **"Select a default Firebase project"**: `imperial-luxury-5b48a`
3. **"What do you want to use as your public directory?"**: `public`
4. **"Configure as a single-page app (rewrite all urls to /index.html)?"**: `No`
5. **"Set up automatic builds and deploys with GitHub?"**: `No`
6. **"File public/index.html already exists. Overwrite?"**: `No` (MUY IMPORTANTE)

---

## 📦 PASO 4: ACTUALIZAR FIREBASE.JSON

Firebase creará un `firebase.json`. Reemplázalo con esta configuración optimizada:

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg|ico)",
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
    ]
  }
}
```

---

## 🚀 PASO 5: DEPLOY A PRODUCCIÓN

```powershell
firebase deploy --only hosting
```

Espera 1-2 minutos. Al finalizar verás:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/imperial-luxury-5b48a/overview
Hosting URL: https://imperial-luxury-5b48a.web.app
```

---

## 🔒 PASO 6: CONFIGURAR REGLAS DE FIRESTORE

**CRÍTICO**: Ve a Firebase Console y publica las reglas.

1. Abre: https://console.firebase.google.com/project/imperial-luxury-5b48a/firestore/rules
2. Copia y pega el contenido de `firestore.rules`
3. Haz clic en **"Publicar"**

**O usa el comando:**

```powershell
firebase deploy --only firestore:rules
```

---

## ☁️ PASO 7: CONFIGURAR CLOUDINARY

### Crear Upload Preset (si no existe)

1. Ve a: https://console.cloudinary.com/settings/upload
2. Clic en **"Add upload preset"**
3. Configuración:
   - **Preset name**: `imperial_cars`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `imperial_cars`
   - **Allowed formats**: `jpg, jpeg, png, webp`
   - **Access mode**: `public`
   - **Transformation**: 
     - Width: `1200`
     - Quality: `auto`
     - Format: `auto`
4. Guardar

---

## ✅ PASO 8: VERIFICACIÓN POST-DEPLOYMENT

### 1. Verifica el sitio en producción:

```
https://imperial-luxury-5b48a.web.app
```

### 2. Prueba funcionalidades:

- [x] Login con `admin@imperialluxury.com` / `admin123`
- [x] Ver catálogo (debe cargar autos)
- [x] Panel Admin accesible
- [x] Crear anuncio (subir imagen desde Cloudinary)
- [x] Editar/eliminar anuncio propio
- [x] Formulario de contacto
- [x] Logout

### 3. Verifica protecciones:

- [x] F12 bloqueado
- [x] Clic derecho bloqueado
- [x] Ctrl+U bloqueado
- [x] Selección de texto bloqueada
- [x] DevTools detectado → Pantalla de advertencia

### 4. Verifica rendimiento:

```powershell
# PageSpeed Insights
# Ve a: https://pagespeed.web.dev/
# Ingresa: https://imperial-luxury-5b48a.web.app
# Debe salir 90+ en móvil y desktop
```

---

## 🔍 COMANDOS ÚTILES

```powershell
# Ver proyecto actual
firebase projects:list

# Ver estado del hosting
firebase hosting:sites:list

# Ver logs en tiempo real
firebase functions:log

# Probar localmente ANTES de deploy
firebase serve --only hosting
# Abre: http://localhost:5000

# Deploy solo reglas Firestore
firebase deploy --only firestore:rules

# Deploy completo (hosting + rules)
firebase deploy
```

---

## 🛠️ TROUBLESHOOTING

### ❌ Error: "Not Found" al cargar imágenes

**Causa**: URLs de Cloudinary incorrectas.

**Solución**: Verifica en `config.js`:
```javascript
CLOUDINARY_CLOUD_NAME: 'dkdoh6z8u'
```

### ❌ Error: "permission-denied" en Firestore

**Causa**: Reglas no publicadas.

**Solución**: 
```powershell
firebase deploy --only firestore:rules
```

### ❌ Error: "Already exists" al crear usuario

**Causa**: Email ya registrado.

**Solución**: Usa otro email o elimina el usuario en:
https://console.firebase.google.com/project/imperial-luxury-5b48a/authentication/users

### ❌ Protecciones no funcionan

**Causa**: Caché del navegador.

**Solución**: Abre en modo incógnito o limpia caché (Ctrl+Shift+Delete)

---

## 📊 MONITOREO

### Firebase Analytics

Ve a: https://console.firebase.google.com/project/imperial-luxury-5b48a/analytics

Verás:
- Usuarios activos
- Páginas más visitadas
- Países de origen
- Dispositivos usados

### Firebase Performance

Ve a: https://console.firebase.google.com/project/imperial-luxury-5b48a/performance

Verás:
- Tiempo de carga
- Latencia de API
- Errores de red

---

## 🎓 DEMOSTRACIÓN PARA PROFESOR

### 1. Muestra la URL en vivo:
```
https://imperial-luxury-5b48a.web.app
```

### 2. Demuestra las protecciones:
- Presiona F12 → Bloqueado
- Clic derecho → Bloqueado
- Ctrl+U → Bloqueado
- Intenta seleccionar texto → Imposible

### 3. Prueba de estrés (opcional):
```powershell
# Instalar Apache Bench (viene con XAMPP)
ab -n 1000 -c 50 https://imperial-luxury-5b48a.web.app/

# Resultado esperado:
# Requests per second: 100-200
# No errores 500
```

### 4. Muestra Firebase Console:
- Firestore: Datos en tiempo real
- Authentication: Usuarios registrados
- Hosting: Tráfico y ancho de banda

---

## 🎯 CHECKLIST FINAL

Antes de presentar al profesor:

- [ ] Sitio deployado y accesible: https://imperial-luxury-5b48a.web.app
- [ ] Reglas Firestore publicadas
- [ ] Cloudinary preset creado (`imperial_cars`)
- [ ] Login funciona (admin + usuarios normales)
- [ ] Marketplace funciona (crear/editar/eliminar autos)
- [ ] Protecciones activas (F12, clic derecho, selección)
- [ ] DevTools detector funciona
- [ ] Imágenes optimizadas (lazy loading + Cloudinary)
- [ ] Límite de 50 carros en consultas
- [ ] Headers de caché configurados
- [ ] Todos los archivos de protección incluidos:
  - `js/protection.js` ✅
  - `css/protection.css` ✅
- [ ] Documentación lista (este archivo + `OPTIMIZACION_ESTRES.md`)

---

## 📞 SOPORTE

Si algo falla durante el deployment:

1. **Revisa los logs**:
   ```powershell
   firebase deploy --debug
   ```

2. **Verifica permisos**:
   - Ve a: https://console.firebase.google.com/project/imperial-luxury-5b48a/settings/iam
   - Tu usuario debe tener rol "Owner" o "Editor"

3. **Reinstala Firebase CLI**:
   ```powershell
   npm uninstall -g firebase-tools
   npm install -g firebase-tools
   ```

---

**🎉 ¡Listo! Tu aplicación estará en producción con máxima seguridad y optimización.**
