# 📝 GUÍA RÁPIDA - NUEVAS FUNCIONALIDADES

## Fecha: 10 de Febrero 2026

---

## ✅ NUEVAS CARACTERÍSTICAS IMPLEMENTADAS

### 1. 🗄️ **SCRIPT DE SEED - Poblar Base de Datos**

**Archivo**: `backend/seed.js`

**Qué hace**: Llena la base de datos con 16 vehículos de lujo de ejemplo

**Vehículos incluidos**:
- Ferrari 488 GTB ($280,000)
- Lamborghini Huracán EVO ($310,000)
- Porsche 911 Turbo S ($225,000)
- Mercedes-Benz AMG GT R ($185,000)
- Rolls-Royce Phantom ($485,000)
- Bentley Continental GT ($240,000)
- Aston Martin DBS Superleggera ($335,000) - Reservado
- McLaren 720S ($315,000)
- BMW M8 Competition ($155,000)
- Audi R8 V10 Performance ($198,000)
- Bugatti Chiron ($3,200,000) - Vendido
- Maserati MC20 ($235,000)
- Pagani Huayra ($2,800,000) - Reservado
- Jaguar F-Type R ($125,000)
- Lexus LC 500 ($98,000)
- Corvette C8 Z06 ($115,000)

**Cómo ejecutar**:
```bash
# Método 1: Desde Docker
docker compose exec backend node seed.js

# Método 2: Desde local (si tienes Node.js)
cd backend
node seed.js
```

**Características del script**:
- ✅ Verifica si ya existe admin (no lo duplica)
- ✅ Detecta si ya hay vehículos (avisa antes de eliminar)
- ✅ Espera 3 segundos antes de eliminar datos existentes (puedes cancelar con Ctrl+C)
- ✅ Todos los autos son del admin
- ✅ Imágenes de alta calidad desde Unsplash
- ✅ Precios realistas de mercado
- ✅ Descripciones detalladas
- ✅ 3 estados: Disponible (13), Reservado (2), Vendido (1)

---

### 2. ✏️ **BOTÓN DE EDITAR EN CATÁLOGO**

**Ubicación**: [index.html](index.html) - Catálogo principal

**Qué hace**: Muestra botón "✏️ Editar Vehículo" en cada card del catálogo

**Cuándo aparece**:
- ✅ Si estás autenticado
- ✅ Si eres el dueño del vehículo O eres admin

**Apariencia**:
- Color: Naranja (#f59e0b)
- Texto: "✏️ Editar Vehículo"
- Posición: Debajo del botón de contacto
- Hover effect: Cambia a naranja más oscuro

**Qué hace al hacer clic**:
1. Redirige a `admin.html?edit=ID_DEL_VEHICULO`
2. Abre automáticamente el modal de edición
3. Precarga todos los datos del vehículo
4. Muestra imagen actual
5. Listo para cambiar la foto URL

---

### 3. 🔗 **EDICIÓN DIRECTA DESDE URL**

**Funcionalidad**: Parámetro `?edit=ID` en la URL

**Archivos modificados**:
- `public/js/admin.js` - Panel admin
- `public/js/my-ads.js` - Mis anuncios

**Cómo funciona**:
1. Usuario hace clic en "✏️ Editar" en el catálogo
2. Es redirigido a `admin.html?edit=67890abcdef`
3. JavaScript detecta el parámetro automáticamente
4. Carga los datos del vehículo
5. Abre el modal prellenado
6. Limpia la URL después de cargar (queda solo `admin.html`)

**Ventajas**:
- ✅ Edición rápida desde cualquier página
- ✅ Links directos compartibles
- ✅ Experiencia de usuario fluida
- ✅ No recarga innecesaria

---

## 🎨 CÓMO CAMBIAR LA FOTO DE UN AUTO

### Opción 1: Editar URL de Imagen Directamente

1. Ve al catálogo principal ([http://localhost:8080](http://localhost:8080))
2. Inicia sesión como admin
3. Busca el vehículo que quieres editar
4. Haz clic en **"✏️ Editar Vehículo"**
5. Se abrirá el modal de edición con todos los datos precargados
6. **Cambia el campo "Imagen del Vehículo"** por una nueva URL:
   - Encuentra una imagen en Google, Unsplash, etc.
   - Copia la URL de la imagen
   - Pégala en el campo
7. Haz clic en **"💾 Guardar"**
8. ¡Listo! La imagen se actualiza

### Opción 2: Subir Nueva Imagen con Cloudinary

1. Sigue los pasos 1-4 de la Opción 1
2. Haz clic en **"📸 Seleccionar Imagen"** (botón Cloudinary)
3. Selecciona una imagen de tu computadora
4. Espera a que se suba
5. Verás el preview automáticamente
6. Haz clic en **"💾 Guardar"**

---

## 📸 FUENTES DE IMÁGENES RECOMENDADAS

### Unsplash (Gratuitas, Alta Calidad)
```
https://unsplash.com/s/photos/luxury-car
https://unsplash.com/s/photos/ferrari
https://unsplash.com/s/photos/lamborghini
https://unsplash.com/s/photos/porsche
```

**Cómo obtener URL**:
1. Busca el auto en Unsplash
2. Haz clic derecho en la imagen
3. "Copiar dirección de imagen"
4. Pega en el campo de imagen

### Formato de URL de Unsplash
```
https://images.unsplash.com/photo-XXXXXXXX?w=800
```

El `?w=800` al final optimiza la imagen a 800px de ancho (perfecto para el sitio).

---

## 🔧 COMANDOS ÚTILES

### Limpiar y repoblar base de datos:
```bash
# 1. Eliminar todos los vehículos actuales
docker compose exec backend node -e "
const mongoose = require('mongoose');
const Car = mongoose.model('Car', new mongoose.Schema({}, { strict: false }));
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Car.deleteMany({});
  console.log('✅ Vehículos eliminados');
  process.exit(0);
});
"

# 2. Ejecutar seed de nuevo
docker compose exec backend node seed.js
```

### Ver vehículos en la base de datos:
```bash
docker compose exec mongodb mongosh imperial-luxury --quiet --eval "db.cars.find().pretty()"
```

### Contar vehículos:
```bash
docker compose exec mongodb mongosh imperial-luxury --quiet --eval "db.cars.countDocuments()"
```

---

## 🎯 FLUJO DE TRABAJO RECOMENDADO

### Para Demo/Presentación:

1. **Ejecutar seed** (si no lo has hecho):
   ```bash
   docker compose exec backend node seed.js
   ```

2. **Abrir aplicación**:
   - Ir a [http://localhost:8080](http://localhost:8080)
   - Login: admin@imperialluxury.com / admin123

3. **Cambiar fotos** (si quieres personalizar):
   - Hacer clic en "✏️ Editar" en cualquier vehículo
   - Cambiar URL de imagen
   - Guardar

4. **Demostrar funcionalidades**:
   - Catálogo lleno de autos
   - Botón de editar visible
   - Edición rápida
   - Diferentes estados (Disponible/Vendido/Reservado)

---

## 💡 TIPS

### URLs de imágenes de alta calidad:
- **Unsplash**: `https://images.unsplash.com/photo-ID?w=800`
- **Pexels**: `https://images.pexels.com/photos/ID/pexels-photo-ID.jpeg?w=800`

### Si una imagen no carga:
1. Verifica que la URL sea accesible (abre en navegador)
2. Asegúrate de que termine en `.jpg`, `.png`, `.jpeg` o `.webp`
3. Evita URLs con redirecciones
4. Usa URLs directas de la imagen, no de páginas

### Atajos de teclado en el modal:
- `Enter` en cualquier campo → Guarda el formulario
- `Esc` → Cierra el modal (próximamente)

---

## 📊 ESTADÍSTICAS ACTUALES

Después del seed:
- **Total vehículos**: 16
- **Disponibles**: 13
- **Reservados**: 2
- **Vendidos**: 1
- **Precio promedio**: $512,000
- **Más caro**: Bugatti Chiron ($3.2M)
- **Más económico**: Lexus LC 500 ($98K)

---

## ⚠️ NOTAS IMPORTANTES

1. **El botón de editar solo aparece si**:
   - Estás autenticado (logged in)
   - Eres el dueño del vehículo O eres admin

2. **Si no ves el botón**:
   - Verifica que hayas iniciado sesión
   - Refresca la página (F5)

3. **Para eliminar el seed y empezar de cero**:
   ```bash
   docker compose down -v  # Elimina volumen con datos
   docker compose up -d     # Inicia de nuevo
   docker compose exec backend node seed.js  # Repoblar
   ```

---

## 🚀 PRÓXIMAS MEJORAS (Opcional)

- [ ] Subida drag & drop de imágenes
- [ ] Galería de imágenes múltiples por vehículo
- [ ] Crop/resize automático de imágenes
- [ ] Filtros en catálogo (por marca, precio, año)
- [ ] Búsqueda de texto en catálogo
- [ ] Favoritos para usuarios

---

**¿Preguntas?** Revisa la documentación completa en:
- [CHECKLIST_COMPLETO.md](CHECKLIST_COMPLETO.md)
- [SEGURIDAD_BACKEND.md](SEGURIDAD_BACKEND.md)
- [RESUMEN_PROYECTO.txt](RESUMEN_PROYECTO.txt)
