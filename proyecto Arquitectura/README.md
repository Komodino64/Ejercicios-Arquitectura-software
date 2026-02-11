# 🏆 Imperial Luxury Cars

> Sistema de gestión y venta de vehículos de lujo desarrollado con ASP.NET Core 10.0

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![.NET](https://img.shields.io/badge/.NET-10.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

Imperial Luxury Cars es una aplicación web completa para la gestión y venta de vehículos de lujo. Incluye un catálogo público con sistema de búsqueda y filtros, página de detalles de vehículos, formulario de contacto, y un panel de administración completo con operaciones CRUD.

## ✨ Características Principales

### 🌐 Área Pública
- **Catálogo de Vehículos**: Visualización de todos los vehículos disponibles
- **Búsqueda Avanzada**: Filtros por marca, modelo y precio
- **Detalles Completos**: Vista detallada de cada vehículo con todas sus especificaciones
- **Formulario de Contacto**: Sistema de mensajería con referencia a vehículos

### 🔐 Panel de Administración
- **Dashboard**: Estadísticas en tiempo real del inventario
- **CRUD Completo**: Crear, leer, actualizar y eliminar vehículos
- **Gestión de Mensajes**: Visualización de todos los mensajes de contacto
- **Cambio de Estado**: Disponible, Vendido, Reservado

## 🛠️ Tecnologías Utilizadas

### Backend
- ASP.NET Core 10.0
- Entity Framework Core 9.0
- SQLite Database
- Razor Pages (MVVM Pattern)
- LINQ
- Async/Await

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Media Queries)
- JavaScript
- jQuery Validation
- Responsive Design

## 📦 Instalación

### Requisitos Previos
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Editor de código (VS Code, Visual Studio, etc.)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd "proyecto Arquitectura"
```

2. **Restaurar paquetes**
```bash
dotnet restore
```

3. **Compilar el proyecto**
```bash
dotnet build
```

4. **Ejecutar la aplicación**
```bash
dotnet run
```

5. **Abrir en el navegador**
```
http://localhost:5000
```

## 📁 Estructura del Proyecto

```
ImperialLuxuryCars/
│
├── Data/
│   └── ApplicationDbContext.cs       # Contexto de EF Core
│
├── Models/
│   ├── Car.cs                        # Modelo de vehículo
│   └── ContactMessage.cs             # Modelo de mensajes
│
├── Pages/
│   ├── Index.cshtml                  # Página principal
│   ├── Details.cshtml                # Detalles de vehículo
│   ├── Contact.cshtml                # Formulario contacto
│   ├── Admin.cshtml                  # Dashboard admin
│   └── Admin/
│       ├── Create.cshtml             # Crear vehículo
│       ├── Edit.cshtml               # Editar vehículo
│       ├── Delete.cshtml             # Eliminar vehículo
│       └── Messages.cshtml           # Ver mensajes
│
├── wwwroot/
│   └── css/
│       ├── site.css                  # Estilos principales
│       └── admin.css                 # Estilos admin
│
└── Program.cs                        # Configuración app
```

## 🚀 Uso del Sistema

### Para Usuarios Públicos

1. **Ver Catálogo**
   - Acceder a la página principal
   - Visualizar todos los vehículos disponibles

2. **Buscar Vehículos**
   - Usar la barra de búsqueda
   - Aplicar filtros por marca y precio
   - Ver resultados en tiempo real

3. **Ver Detalles**
   - Click en "Ver Detalles" en cualquier vehículo
   - Visualizar especificaciones completas
   - Ver precio y disponibilidad

4. **Contactar**
   - Click en "Contactar" desde el detalle
   - Llenar formulario con consulta
   - Enviar mensaje (se guarda en BD)

### Para Administradores

1. **Acceder al Panel**
   - Ir a `/Admin`
   - Ver dashboard con estadísticas

2. **Gestionar Vehículos**
   - **Crear**: Click en "➕ Agregar Vehículo"
   - **Editar**: Click en "✏️" junto al vehículo
   - **Eliminar**: Click en "🗑️" y confirmar
   - **Ver Todos**: En la tabla principal

3. **Ver Mensajes**
   - Click en "Ver Todos" en sección de mensajes
   - Visualizar detalles completos de consultas

## 📊 Base de Datos

### Modelo de Datos

**Tabla: Cars**
- Id (int) - Primary Key
- Brand (string) - Marca del vehículo
- Model (string) - Modelo
- Year (int) - Año de fabricación
- Price (decimal) - Precio
- Mileage (int) - Kilometraje
- Color (string) - Color
- FuelType (string) - Tipo de combustible
- Transmission (string) - Tipo de transmisión
- ImageUrl (string) - URL de imagen
- Description (string) - Descripción
- Status (string) - Estado (Disponible/Vendido/Reservado)

**Tabla: ContactMessages**
- Id (int) - Primary Key
- Name (string) - Nombre del contacto
- Email (string) - Email
- Phone (string) - Teléfono
- Message (string) - Mensaje
- CarId (int?) - Referencia al vehículo (opcional)
- CreatedAt (DateTime) - Fecha de creación

### Datos Iniciales

El sistema incluye 6 vehículos de ejemplo:
1. Mercedes-Benz S-Class 2024 - $120,000
2. BMW 7 Series 2024 - $105,000
3. Audi A8 2023 - $95,000
4. Porsche Panamera 2024 - $140,000
5. Jaguar XJ 2023 - $88,000
6. Lexus LS 500 2024 - $92,000

## 🎨 Características de Diseño

- ✅ **Responsive**: Funciona en desktop, tablet y móvil
- ✅ **Modern UI**: Diseño limpio y profesional
- ✅ **Color Scheme**: Negro, dorado y blanco (elegante)
- ✅ **Animations**: Transiciones suaves en hover
- ✅ **Icons**: Emojis descriptivos para mejor UX
- ✅ **Typography**: Fuentes profesionales

## 🔒 Seguridad

- Bloqueo de selección de texto
- Prevención de clic derecho
- Bloqueo de teclas de desarrollador (F12, Ctrl+U, Ctrl+Shift+I)
- Validaciones del lado del servidor
- Validaciones del lado del cliente
- Protección contra inyecciones SQL (usando EF Core)

## 🧪 Testing

Para probar la aplicación:

1. **Catálogo**: Verifica que se muestren los 6 vehículos iniciales
2. **Búsqueda**: Busca "Mercedes" - debe mostrar solo Mercedes-Benz
3. **Filtro Precio**: Establece precio máximo de $100,000
4. **Detalles**: Click en cualquier vehículo para ver detalles
5. **Contacto**: Envía un mensaje de prueba
6. **Admin**: Accede a `/Admin` y prueba crear/editar/eliminar

## 📝 Notas Importantes

- La base de datos SQLite se crea automáticamente en el primer run
- El archivo `imperialluxury.db` contiene todos los datos
- Para resetear la BD, simplemente elimina el archivo .db y reinicia
- Las validaciones funcionan tanto en cliente como en servidor
- Todos los textos están en español

## 🐛 Solución de Problemas

**Puerto ocupado:**
```bash
# Matar procesos dotnet
Get-Process | Where-Object {$_.ProcessName -eq "dotnet"} | Stop-Process -Force
```

**Base de datos bloqueada:**
```bash
# Eliminar archivo de BD y reiniciar
rm imperialluxury.db
dotnet run
```

**Paquetes faltantes:**
```bash
dotnet restore
dotnet build
```

## 📈 Roadmap Futuro

### Versión 2.0
- [ ] Autenticación de usuarios
- [ ] Sistema de roles
- [ ] Subida de múltiples imágenes
- [ ] Comparador de vehículos
- [ ] Sistema de favoritos

### Versión 3.0
- [ ] Integración con pasarela de pagos
- [ ] Sistema de reservas online
- [ ] Notificaciones por email
- [ ] API REST
- [ ] App móvil

## 👥 Contacto

**Imperial Luxury Cars**
- 📞 Teléfono: +57 302 6648008
- 📧 Email: ventas@imperialluxurycars.com
- 📍 Dirección: Carrera 119a#70a-65

## 📄 Licencia

Este proyecto fue desarrollado como proyecto académico para el curso de Arquitectura de Software.

---

**Desarrollado con ❤️ usando ASP.NET Core**
