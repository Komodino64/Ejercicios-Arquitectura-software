# 🔥 Instrucciones de Configuración - Imperial Luxury Cars

## PASO 1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Nombre del proyecto: **imperial-luxury-cars**
4. Desactiva Google Analytics (no es necesario para este proyecto)
5. Haz clic en "Crear proyecto"

## PASO 2: Configurar Firebase Authentication

1. En el menú lateral, ve a **Build** → **Authentication**
2. Haz clic en "Get started"
3. En la pestaña "Sign-in method":
   - Habilita **Email/Password**
   - NO habilites "Email link (passwordless sign-in)"
4. Guarda los cambios

## PASO 3: Configurar Firestore Database

1. En el menú lateral, ve a **Build** → **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona **"Start in test mode"** (cambiaremos las reglas después)
4. Ubicación: **us-central1** (o la más cercana a Colombia)
5. Haz clic en "Enable"

## PASO 4: Obtener Configuración de Firebase

1. Ve a **Project Settings** (⚙️ en el menú lateral superior)
2. Baja hasta "Your apps"
3. Haz clic en el ícono **</>** (Web)
4. Nombre de la app: **Imperial Luxury Cars Web**
5. NO marques "Also set up Firebase Hosting"
6. Haz clic en "Register app"
7. **COPIA EL OBJETO firebaseConfig** - lo necesitaremos después:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

8. Guarda esta configuración en un lugar seguro

## PASO 5: Crear Usuario Admin en Firebase

1. Ve a **Authentication** → **Users**
2. Haz clic en "Add user"
3. Email: **admin@imperialluxury.com**
4. Password: **admin123** (o la que prefieras)
5. Guarda el **UID** del usuario (lo necesitaremos)

---

## PASO 6: Crear Cuenta Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com/users/register/free)
2. Regístrate con tu email
3. Verifica tu email
4. Ve al [Dashboard](https://cloudinary.com/console)

## PASO 7: Obtener Credenciales Cloudinary

En el Dashboard de Cloudinary, encontrarás:

```
Cloud Name: tu-cloud-name
API Key: 123456789012345
API Secret: xxxxxxxxxxxxxxxxx (no la necesitas para frontend)
```

**COPIA SOLO EL CLOUD NAME** - lo necesitaremos después

## PASO 8: Habilitar Upload Preset (Unsigned)

1. En Cloudinary Dashboard, ve a **Settings** → **Upload**
2. Baja hasta "Upload presets"
3. Haz clic en "Add upload preset"
4. Configuración:
   - **Signing Mode**: Unsigned
   - **Preset name**: imperial_cars
   - **Folder**: imperial-luxury-cars
   - **Format**: jpg, png
   - **Transformation**: Limit to 1920x1080
5. Guarda el preset

---

## 📝 Información que Necesitas Guardar

Después de completar los pasos anteriores, debes tener:

✅ **Firebase Config** (objeto completo de 6 propiedades)
✅ **UID del usuario admin** (string largo tipo "Xj3k2L...")
✅ **Cloudinary Cloud Name** (ejemplo: "dzabcdef")
✅ **Cloudinary Upload Preset**: imperial_cars

**¡GUARDA ESTA INFORMACIÓN! La necesitaremos en el siguiente paso.**

---

## ¿Listo?

Una vez que tengas toda esta información, avísame y continuaremos con la configuración del código.
