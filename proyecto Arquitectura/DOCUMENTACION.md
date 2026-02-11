# Imperial Luxury Cars - Documentación del Proyecto

## 📋 Información General
**Proyecto:** Imperial Luxury Cars  
**Tecnologías:** ASP.NET Core (C#), Razor Pages, HTML5, CSS3, JavaScript  
**Framework:** .NET 10.0  
**Fecha:** Febrero 2026

---

## 🏗️ Estructura del Proyecto

```
proyecto Arquitectura/
├── ImperialLuxuryCars.csproj          # Archivo de configuración del proyecto
├── Program.cs                          # Punto de entrada de la aplicación
├── Models/
│   └── Car.cs                         # Modelo de datos para los carros
├── Pages/
│   ├── Index.cshtml                   # Vista principal (HTML + Razor)
│   ├── Index.cshtml.cs                # Código C# detrás de la vista
│   └── _ViewImports.cshtml            # Configuración de imports
└── wwwroot/
    └── css/
        └── site.css                   # Estilos CSS de la aplicación
```

---

## 📦 1. Archivo de Configuración del Proyecto

**Archivo:** `ImperialLuxuryCars.csproj`

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

**Explicación:**
- `Sdk="Microsoft.NET.Sdk.Web"`: Define que es una aplicación web ASP.NET
- `TargetFramework`: Especifica la versión de .NET (10.0)
- `Nullable`: Habilita referencias nulables para mayor seguridad
- `ImplicitUsings`: Importa automáticamente namespaces comunes

---

## 🚀 2. Punto de Entrada (Program.cs)

**Archivo:** `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapRazorPages();

app.Run();
```

**Explicación:**
- **Builder Pattern:** Crea y configura la aplicación
- `AddRazorPages()`: Habilita Razor Pages para las vistas
- `UseStaticFiles()`: Permite servir archivos CSS, imágenes, JavaScript
- `MapRazorPages()`: Mapea las rutas de las páginas Razor
- `app.Run()`: Inicia el servidor web

---

## 🗃️ 3. Modelo de Datos (Car.cs)

**Archivo:** `Models/Car.cs`

```csharp
namespace ImperialLuxuryCars.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Disponible";
    }
}
```

**Explicación:**
- **Clase Car:** Representa un vehículo en el sistema
- **Propiedades:**
  - `Id`: Identificador único
  - `Brand`: Marca del vehículo (Mercedes-Benz, BMW, etc.)
  - `Model`: Modelo específico
  - `Year`: Año de fabricación
  - `Price`: Precio en formato decimal
  - `ImageUrl`: URL de la imagen del vehículo
  - `Description`: Descripción breve
  - `Status`: Estado (Disponible/Vendido)
- `= string.Empty`: Inicializa las cadenas vacías por defecto

---

## 💻 4. Lógica del Backend (Index.cshtml.cs)

**Archivo:** `Pages/Index.cshtml.cs`

```csharp
using Microsoft.AspNetCore.Mvc.RazorPages;
using ImperialLuxuryCars.Models;

namespace ImperialLuxuryCars.Pages
{
    public class IndexModel : PageModel
    {
        public List<Car> Cars { get; set; } = new();

        public void OnGet()
        {
            // Datos de ejemplo - más adelante se conectará a base de datos
            Cars = new List<Car>
            {
                new Car
                {
                    Id = 1,
                    Brand = "Mercedes-Benz",
                    Model = "S-Class",
                    Year = 2024,
                    Price = 120000,
                    ImageUrl = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500",
                    Description = "Lujo y elegancia en su máxima expresión",
                    Status = "Disponible"
                },
                // ... (otros 5 carros)
            };
        }
    }
}
```

**Explicación:**
- **IndexModel:** Clase que maneja la lógica de la página principal
- **Hereda de PageModel:** Patrón Razor Pages
- **Property Cars:** Lista de vehículos disponibles
- **Método OnGet():** Se ejecuta cuando se carga la página (petición GET)
  - Actualmente con datos estáticos
  - En producción se conectaría a una base de datos

---

## 🎨 5. Vista HTML con Razor (Index.cshtml)

**Archivo:** `Pages/Index.cshtml`

### Estructura Principal:

```html
@page
@model ImperialLuxuryCars.Pages.IndexModel
@{
    ViewData["Title"] = "Imperial Luxury Cars";
}
```

**Explicación de Razor Syntax:**
- `@page`: Define que este archivo es una Razor Page
- `@model`: Especifica el modelo C# asociado (IndexModel)
- `@{ }`: Bloque de código C# para configurar ViewData

### Sección Head:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@ViewData["Title"]</title>
    <link rel="stylesheet" href="~/css/site.css">
    <style>
        /* Bloqueo de selección de texto */
        body {
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE10+/Edge */
            user-select: none; /* Estándar */
        }
    </style>
</head>
```

**Explicación:**
- `@ViewData["Title"]`: Interpola el título desde C#
- `~/css/site.css`: El `~` representa la raíz del proyecto
- **user-select: none**: Impide que el usuario seleccione texto

### Catálogo de Vehículos:

```html
<div class="cars-grid">
    @foreach (var car in Model.Cars)
    {
        <div class="car-card">
            <img src="@car.ImageUrl" alt="@car.Brand @car.Model" />
            <div class="car-info">
                <h3>@car.Brand @car.Model</h3>
                <p class="year">Año: @car.Year</p>
                <p class="description">@car.Description</p>
                <div class="car-footer">
                    <span class="price">$@car.Price.ToString("N0")</span>
                    <span class="status @(car.Status.ToLower())">@car.Status</span>
                </div>
                <button class="btn-contact">Contactar</button>
            </div>
        </div>
    }
</div>
```

**Explicación:**
- `@foreach`: Bucle de Razor que itera sobre la lista de carros
- `@car.Property`: Accede a las propiedades del objeto Car
- `@car.Price.ToString("N0")`: Formatea el precio con separador de miles
- `@(car.Status.ToLower())`: Expresión C# para agregar clase CSS dinámica

---

## 🛡️ 6. Protección JavaScript

**JavaScript al final del body:**

```javascript
<script>
    // 1. Bloquear Clic Derecho
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        alert('El código de este sitio está protegido.');
    });

    // 2. Bloquear Teclas Comunes (F12, Ctrl+U, Ctrl+S)
    document.onkeydown = function (e) {
        // F12
        if (e.keyCode == 123) {
            return false;
        }
        // Ctrl+U (Ver código fuente)
        if (e.ctrlKey && e.keyCode == 85) {
            return false;
        }
        // Ctrl+Shift+I (Inspector)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            return false;
        }
    };
</script>
```

**Explicación de las Protecciones:**

### a) Bloqueo de Clic Derecho
```javascript
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert('El código de este sitio está protegido.');
});
```
- **contextmenu**: Evento que se dispara con clic derecho
- **preventDefault()**: Cancela el menú contextual predeterminado
- **alert()**: Muestra mensaje al usuario

### b) Bloqueo de Teclas
```javascript
document.onkeydown = function (e) {
    if (e.keyCode == 123) return false;  // F12
    if (e.ctrlKey && e.keyCode == 85) return false;  // Ctrl+U
    if (e.ctrlKey && e.shiftKey && e.keyCode == 73) return false;  // Ctrl+Shift+I
};
```
- **keyCode 123**: F12 (Herramientas de desarrollador)
- **keyCode 85**: U (Ver código fuente)
- **keyCode 73**: I (Inspector)
- **return false**: Previene la acción predeterminada

---

## 🎨 7. Estilos CSS (site.css)

### Reset y Configuración Base

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}
```

### Header con Gradiente

```css
header {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    padding: 40px 0;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
```

**Explicación:**
- `linear-gradient`: Crea un degradado del negro al gris
- `box-shadow`: Agrega sombra debajo del header
- `135deg`: Ángulo del degradado

### Grid Responsive de Carros

```css
.cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}
```

**Explicación:**
- `display: grid`: Sistema de diseño en rejilla
- `repeat(auto-fit, ...)`: Crea columnas automáticamente
- `minmax(350px, 1fr)`: Mínimo 350px, máximo fracción disponible
- `gap: 30px`: Espacio entre tarjetas

### Tarjetas de Carros con Efectos

```css
.car-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.car-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}
```

**Explicación:**
- `border-radius`: Esquinas redondeadas
- `overflow: hidden`: Oculta contenido que sobresale
- `transition`: Animación suave de 0.3 segundos
- `:hover`: Efecto al pasar el mouse (eleva la tarjeta 5px)

### Diseño Responsive

```css
@media (max-width: 768px) {
    header h1 {
        font-size: 1.8em;
    }
    
    .cars-grid {
        grid-template-columns: 1fr;
    }
    
    nav a {
        margin: 0 10px;
        font-size: 0.9em;
    }
}
```

**Explicación:**
- `@media`: Media query para pantallas pequeñas
- `max-width: 768px`: Aplica en tablets y móviles
- `grid-template-columns: 1fr`: Una sola columna en móviles

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos:
- .NET 10.0 SDK instalado
- Terminal (PowerShell, CMD o Bash)

### Pasos:

1. **Navegar al directorio del proyecto:**
```bash
cd "c:\arquitectura-software-main\proyecto Arquitectura"
```

2. **Ejecutar la aplicación:**
```bash
dotnet run
```

3. **Abrir en el navegador:**
```
http://localhost:5000
```

4. **Para detener el servidor:**
```
Ctrl + C
```

---

## 🛡️ Resumen de Medidas de Protección Implementadas

### Paso 1: Bloqueo de Selección de Texto
- ✅ CSS `user-select: none` aplicado
- Impide seleccionar/copiar texto e imágenes

### Paso 2: Bloqueo de Interacción con DevTools
- ✅ Clic derecho deshabilitado
- ✅ F12 bloqueada
- ✅ Ctrl+U bloqueado (ver código fuente)
- ✅ Ctrl+Shift+I bloqueado (inspector)

### Nota sobre Seguridad:
Estas son medidas de **"capa de molestia"** que dificultan el acceso casual, pero no son infalibles. Un usuario técnico avanzado puede:
- Abrir DevTools desde el menú del navegador
- Deshabilitar JavaScript
- Ver el código fuente del servidor

---

## 📚 Conceptos Clave del Proyecto

### 1. Patrón MVC/MVVM (Razor Pages)
- **Model (Car.cs):** Representa los datos
- **View (Index.cshtml):** Presenta la interfaz
- **ViewModel (IndexModel):** Maneja la lógica de presentación

### 2. Razor Syntax
- `@`: Transición de HTML a C#
- `@{ }`: Bloque de código C#
- `@foreach`: Bucles
- `@model`: Vinculación con el modelo

### 3. ASP.NET Core Pipeline
```
Request → Routing → Razor Page → Model Binding → 
Page Handler (OnGet) → View Rendering → Response
```

### 4. Responsive Design
- CSS Grid para layouts flexibles
- Media queries para adaptación móvil
- Mobile-first approach

### 5. Event Handling en JavaScript
- `addEventListener`: Manejo de eventos modernos
- `preventDefault()`: Cancela comportamiento predeterminado
- Key codes para detectar teclas específicas

---

## 🔄 Próximas Mejoras Sugeridas

### Base de Datos:
- Conectar a SQL Server o PostgreSQL
- Crear entidad DBContext
- Implementar Entity Framework Core

### Funcionalidades:
- Sistema de búsqueda y filtros
- Carrito de compras
- Registro de usuarios
- Panel de administración
- Sistema de reservas

### Seguridad:
- Autenticación y autorización
- Protección CSRF
- Validación de inputs
- Rate limiting

---

## 📝 Comandos Útiles

```bash
# Restaurar dependencias
dotnet restore

# Compilar proyecto
dotnet build

# Ejecutar en modo desarrollo
dotnet run

# Ejecutar con watch (recarga automática)
dotnet watch run

# Publicar para producción
dotnet publish -c Release

# Limpiar archivos compilados
dotnet clean
```

---

## 🎓 Para el Estudio y Presentación

### Puntos Clave a Destacar:

1. **Arquitectura Limpia:** Separación clara entre modelos, vistas y lógica
2. **Tecnología Moderna:** ASP.NET Core con .NET 10
3. **Responsive Design:** Funciona en cualquier dispositivo
4. **Protección del Código:** Medidas anti-copia implementadas
5. **Escalabilidad:** Fácil agregar más funcionalidades

### Diagrama de Flujo:
```
Usuario → Navegador → http://localhost:5000
    ↓
ASP.NET Core (Program.cs)
    ↓
Routing → /Index
    ↓
IndexModel.OnGet() → Carga datos de carros
    ↓
Index.cshtml → Renderiza HTML con Razor
    ↓
CSS (site.css) → Aplica estilos
    ↓
JavaScript → Aplica protecciones
    ↓
← Respuesta HTML al navegador
```

---

## 📞 Información de Contacto de la Empresa

- **Teléfono:** +57 302 6648008
- **Email:** ventas@imperialluxurycars.com
- **Dirección:** Carrera 119a#70a-65

---

## ✅ Checklist de Funcionalidades

- [x] Estructura base del proyecto ASP.NET Core
- [x] Modelo de datos (Car)
- [x] Vista principal con catálogo
- [x] Estilos CSS responsive
- [x] Protección contra selección de texto
- [x] Bloqueo de clic derecho
- [x] Bloqueo de teclas de desarrollador (F12, Ctrl+U, Ctrl+Shift+I)
- [ ] Base de datos (pendiente)
- [ ] Sistema de autenticación (pendiente)
- [ ] Carrito de compras (pendiente)
- [ ] Panel de administración (pendiente)

---

**Fecha de Creación:** Febrero 4, 2026  
**Versión:** 1.0  
**Desarrollado con:** ASP.NET Core + Razor Pages + C#
