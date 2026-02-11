# 🔐 SISTEMA DE AUTENTICACIÓN - IMPERIAL LUXURY CARS
### Implementación exitosa de Login y Registro con ASP.NET Identity

---

## ✅ CARACTERÍSTICAS IMPLEMENTADAS

### 1. **Sistema de Autenticación Completo**
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Cierre de sesión
- ✅ Roles de usuario (Admin y User)
- ✅ Protección de rutas administrativas
- ✅ Navegación condicional según rol

### 2. **Tecnologías Utilizadas**
- **ASP.NET Core Identity**: Sistema de autenticación y autorización
- **Entity Framework Core**: ORM para gestión de base de datos
- **SQLite**: Base de datos con tablas de Identity
- **Cookie Authentication**: Sesiones persistentes (24 horas)
- **Role-Based Authorization**: Control de acceso por roles

---

## 🔑 CREDENCIALES DE ACCESO

### 👨‍💼 CUENTA ADMINISTRADOR (creada automáticamente)
```
Email:      admin@imperialluxury.com
Contraseña: admin123
Rol:        Admin
```

**Permisos del Administrador:**
- ✅ Acceso al panel de administración (/Admin)
- ✅ Crear, editar y eliminar vehículos
- ✅ Ver mensajes de contacto
- ✅ Ver estadísticas del sistema
- ✅ Acceso completo a todas las funcionalidades

### 👤 CUENTAS DE USUARIO NORMAL
Los usuarios pueden registrarse en `/Account/Register`

**Permisos de Usuario Normal:**
- ✅ Ver catálogo de vehículos
- ✅ Ver detalles de vehículos
- ✅ Enviar mensajes de contacto
- ❌ NO puede acceder al panel de administración

---

## 🚀 CÓMO USAR EL SISTEMA

### **1. Iniciar la Aplicación**
```powershell
cd "c:\arquitectura-software-main\proyecto Arquitectura"
dotnet run --project ImperialLuxuryCars.csproj --urls "http://localhost:5000"
```

La aplicación estará disponible en: **http://localhost:5000**

### **2. Probar el Login como Administrador**
1. Abrir http://localhost:5000
2. Hacer clic en "Iniciar Sesión" en el menú
3. Ingresar:
   - **Email:** admin@imperialluxury.com
   - **Contraseña:** admin123
4. Hacer clic en "🔓 Iniciar Sesión"
5. Serás redirigido a la página principal
6. ¡Ahora verás el enlace "Administración" en el menú!

### **3. Crear una Cuenta de Usuario Normal**
1. Abrir http://localhost:5000
2. Hacer clic en "Registrarse" en el menú
3. Llenar el formulario:
   - Nombre Completo
   - Email
   - Contraseña (mínimo 4 caracteres)
   - Confirmar Contraseña
4. Hacer clic en "✅ Registrarse"
5. Automáticamente iniciarás sesión

### **4. Cerrar Sesión**
- Hacer clic en "Cerrar Sesión (tu@email.com)" en el menú

---

## 🛡️ SEGURIDAD IMPLEMENTADA

### **Protección de Rutas Administrativas**
Todas las páginas administrativas están protegidas con el atributo:
```csharp
[Authorize(Roles = "Admin")]
```

**Páginas Protegidas:**
- `/Admin` - Panel de administración
- `/Admin/Create` - Crear vehículo
- `/Admin/Edit` - Editar vehículo
- `/Admin/Delete` - Eliminar vehículo
- `/Admin/Messages` - Ver mensajes de contacto

Si un usuario sin permisos intenta acceder, será redirigido a:
- `/Account/AccessDenied` si está autenticado
- `/Account/Login` si no está autenticado

### **Configuración de Contraseñas**
```csharp
options.Password.RequireDigit = false;
options.Password.RequireLowercase = false;
options.Password.RequireUppercase = false;
options.Password.RequireNonAlphanumeric = false;
options.Password.RequiredLength = 4;  // Mínimo 4 caracteres
```

---

## 📂 ESTRUCTURA DE ARCHIVOS CREADOS

```
📁 Pages/Account/
├── Login.cshtml          # Formulario de inicio de sesión
├── Login.cshtml.cs       # Lógica de login con SignInManager
├── Register.cshtml       # Formulario de registro
├── Register.cshtml.cs    # Lógica de registro con UserManager
├── Logout.cshtml         # Página de cierre de sesión
├── Logout.cshtml.cs      # Lógica para SignOut
└── AccessDenied.cshtml   # Página de acceso denegado

📁 Models/
└── ApplicationUser.cs    # Modelo personalizado de Identity User
                          # (extiende IdentityUser con FullName y CreatedAt)

📄 Data/ApplicationDbContext.cs
   # Cambiado a IdentityDbContext<ApplicationUser>

📄 Program.cs
   # Configuración de Identity, roles y usuario admin
```

---

## 🗄️ BASE DE DATOS

### **Tablas de Identity Creadas Automáticamente:**
- `AspNetUsers` - Usuarios del sistema
- `AspNetRoles` - Roles (Admin, User)
- `AspNetUserRoles` - Relación usuarios-roles
- `AspNetUserClaims` - Claims de usuarios
- `AspNetUserLogins` - Logins externos
- `AspNetUserTokens` - Tokens de autenticación
- `AspNetRoleClaims` - Claims de roles

### **Datos Iniciales (Seed):**
- **2 Roles:** Admin, User
- **1 Usuario Admin:** admin@imperialluxury.com / admin123
- **6 Vehículos de Lujo:** Mercedes, BMW, Audi, Porsche, Jaguar, Lexus

---

## 🎯 FLUJO DE NAVEGACIÓN

### **Usuario NO Autenticado:**
```
┌─────────────────────────────────────────┐
│  Menú: Inicio | Catálogo | Contacto    │
│        Iniciar Sesión | Registrarse     │
└─────────────────────────────────────────┘
```

### **Usuario Normal Autenticado:**
```
┌─────────────────────────────────────────────────┐
│  Menú: Inicio | Catálogo | Contacto            │
│        Cerrar Sesión (usuario@email.com)        │
└─────────────────────────────────────────────────┘
```

### **Usuario Administrador Autenticado:**
```
┌───────────────────────────────────────────────────────────┐
│  Menú: Inicio | Catálogo | Administración | Contacto     │
│        Cerrar Sesión (admin@imperialluxury.com)           │
└───────────────────────────────────────────────────────────┘
```

---

## 💡 CONSEJOS PARA LA PRESENTACIÓN

### **Demostración Sugerida:**

1. **Mostrar Navegación Pública**
   - Abrir página principal sin login
   - Mostrar que NO aparece "Administración" en el menú

2. **Intentar Acceder a Admin Sin Login**
   - Escribir manualmente: http://localhost:5000/Admin
   - Mostrar que redirige a /Account/Login

3. **Login como Usuario Normal**
   - Registrar una cuenta nueva
   - Mostrar que sigue sin ver "Administración"
   - Intentar acceder a /Admin manualmente
   - Mostrar página "Acceso Denegado"

4. **Login como Administrador**
   - Cerrar sesión
   - Iniciar sesión con admin@imperialluxury.com / admin123
   - Mostrar que ahora SÍ aparece "Administración" en el menú
   - Navegar por el panel de administración

5. **Funcionalidades de Admin**
   - Ver dashboard con estadísticas
   - Crear un vehículo nuevo
   - Editar un vehículo existente
   - Ver mensajes de contacto

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### **Error: "Failed to bind to address - port already in use"**
```powershell
# Solución: Matar todos los procesos dotnet
taskkill /F /IM dotnet.exe
Start-Sleep -Seconds 2
dotnet run --project ImperialLuxuryCars.csproj --urls "http://localhost:5000"
```

### **Error: "dotnet-ef no se encuentra"**
```powershell
# Solución: Instalar herramienta EF Core
dotnet tool install --global dotnet-ef
```

### **La base de datos no tiene vehículos**
```powershell
# Solución: Borrar y recrear la base de datos
Remove-Item imperialluxury.db
dotnet ef database update
dotnet run
# El seed se ejecutará automáticamente al iniciar la app
```

### **No puedo iniciar sesión como admin**
Verificar en la base de datos que el usuario existe:
```sql
-- Abrir con SQLite browser o comando:
sqlite3 imperialluxury.db "SELECT Email, EmailConfirmed FROM AspNetUsers;"
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

Antes de presentar, verificar:

- [ ] La aplicación inicia sin errores en puerto 5000
- [ ] La base de datos existe (imperialluxury.db)
- [ ] Puedo acceder a http://localhost:5000
- [ ] Veo 6 vehículos en el catálogo
- [ ] Puedo registrar un usuario nuevo
- [ ] Puedo iniciar sesión con admin@imperialluxury.com / admin123
- [ ] Como admin, veo el enlace "Administración"
- [ ] Como admin, puedo acceder al panel /Admin
- [ ] Como usuario normal, NO veo "Administración"
- [ ] Como usuario normal, /Admin me muestra "Acceso Denegado"
- [ ] El logout funciona correctamente
- [ ] Los mensajes de error se muestran correctamente

---

## 🎉 ¡SISTEMA DE AUTENTICACIÓN COMPLETO!

Has implementado exitosamente:
✅ ASP.NET Core Identity con SQLite
✅ Login y registro de usuarios
✅ Control de acceso basado en roles
✅ Protección de rutas administrativas
✅ Navegación condicional según usuario
✅ Gestión de sesiones con cookies
✅ Seeding automático de datos

**URL de Acceso:** http://localhost:5000
**Credenciales Admin:** admin@imperialluxury.com / admin123

¡Buena suerte con la presentación! 🚗💎
