# 🌐 ACCESO RED LOCAL - Imperial Luxury Cars

## ✅ Sistema Configurado para Acceso Remoto

El sistema ahora acepta conexiones desde cualquier dispositivo en tu red local (WiFi).

---

## 📱 CÓMO ACCEDER DESDE OTRO DISPOSITIVO

### 1️⃣ Obtén tu IP Local

**Ejecuta este script:**
```bash
.\get-network-url.bat
```

Este script te mostrará:
- ✅ Tu IP local (ejemplo: `192.168.1.45`)
- 📱 URLs para acceder desde otros dispositivos
- 🔥 Estado del firewall
- 🛠️ Opción para configurar firewall automáticamente

### 2️⃣ Desde Otro Dispositivo

**En tu celular, tablet u otra PC:**

1. Conéctate al **MISMO WiFi**
2. Abre el navegador
3. Ingresa: `http://TU_IP:8080`
   - Ejemplo: `http://192.168.1.45:8080`

---

## 🔥 Configurar Firewall de Windows

Si no puedes acceder desde otro dispositivo, necesitas abrir los puertos:

### Opción A: Automática (Recomendado)
```bash
.\get-network-url.bat
# Responde "S" cuando pregunte si quieres crear reglas
```

### Opción B: Manual

1. **Abrir Panel de Control** → Firewall de Windows
2. **Reglas de entrada** → Nueva regla
3. **Puerto** → TCP → Puertos específicos: `8080,5000`
4. **Permitir conexión** → Siguiente
5. **Aplicar a**: Dominio, Privado, Público
6. **Nombre**: "Imperial Luxury Cars"

---

## 🎯 URLs de Acceso

### En esta PC (localhost):
- **Frontend**: http://localhost:8080  
- **Backend**: http://localhost:5000

### Desde red local (otros dispositivos):
- **Frontend**: http://TU_IP:8080  
- **Backend**: http://TU_IP:5000

---

## ⚡ Cómo Funciona

### Backend (CORS Flexible):
```javascript
// Acepta conexiones de:
- localhost, 127.0.0.1
- 192.168.x.x (red local clase C)
- 10.x.x.x (red local clase A)
- 172.16-31.x.x (red local clase B)
```

### Frontend (Auto-detección):
```javascript
// api-config.js detecta automáticamente:
- Si accedes por localhost → usa http://localhost:5000
- Si accedes por IP → usa http://TU_IP:5000
```

---

## 🧪 Probar Acceso

### Desde esta PC:
```bash
# Test frontend
Start http://localhost:8080

# Test backend
curl http://localhost:5000
```

### Desde otro dispositivo:
1. Abre navegador en tu celular
2. Ingresa: `http://TU_IP:8080`
3. Deberías ver la página cargando

---

## 🚨 Solución de Problemas

### "No se puede acceder al sitio"

**Causa común:** Firewall bloqueando

**Solución:**
```bash
# Ejecuta como administrador:
netsh advfirewall firewall add rule name="Imperial Frontend" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="Imperial Backend" dir=in action=allow protocol=TCP localport=5000
```

### "Error de CORS"

**Causa:** IP no permitida

**Verificación:** Revisa que tu IP esté en rango permitido (192.168.x.x)

**Solución:** Ya está configurado para aceptar IPs locales automáticamente

### "Cannot GET /api/cars"

**Causa:** Backend no está corriendo

**Solución:**
```bash
docker compose ps
docker compose restart backend
```

---

## 📊 Verificar Configuración

### 1. Ver IP local:
```bash
ipconfig | findstr IPv4
```

### 2. Verificar puertos abiertos:
```bash
netstat -ano | findstr ":8080"
netstat -ano | findstr ":5000"
```

### 3. Test desde otro dispositivo:
```bash
# En el otro dispositivo (terminal/cmd):
ping TU_IP
curl http://TU_IP:5000
```

---

## 🔒 Seguridad

- ✅ Solo accesible en red local (no internet público)
- ✅ Rate limiting activo (50 req/10min)
- ✅ CORS configurado para IPs privadas
- ✅ Firewall debe estar activo

**IMPORTANTE:** No exponer a internet sin configurar SSL/HTTPS y autenticación robusta.

---

## 💡 Casos de Uso

### Pruebas con celular:
1. Ejecuta `.\get-network-url.bat`
2. Copia la URL mostrada
3. Abre en navegador móvil

### Demostración a cliente:
1. Cliente se conecta al mismo WiFi
2. Le das la URL: `http://TU_IP:8080`
3. Cliente prueba la aplicación

### Desarrollo en equipo:
- Frontend: `http://TU_IP:8080`
- Backend API: `http://TU_IP:5000/api`
- MongoDB: `TU_IP:27017` (proteger en producción)

---

✅ **Sistema listo para pruebas en red local**
