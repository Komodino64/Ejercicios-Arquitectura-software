# Ejercicios 34 y 35 - Arquitectura de Software a Tres Capas

## Descripción
Este proyecto implementa una arquitectura de software a tres capas utilizando el enfoque clásico ADO.NET en C#.

## Estructura del Proyecto

```
ejercicios 34 y 35/
│
├── Entidades/
│   └── Cliente.cs                 # Clase entidad Cliente
│
├── CapaDatos/
│   └── DatosCliente.cs           # Capa de acceso a datos
│
├── CapaLogica/
│   └── LogicaCliente.cs          # Capa de lógica de negocio (Ejercicio 34)
│
├── Conexion.cs                    # Clase de conexión (Ejercicio 35)
├── Program.cs                     # Programa de demostración
└── README.md                      # Este archivo
```

## Ejercicio 34: Método InsertarCliente

**Ubicación:** `CapaLogica/LogicaCliente.cs`

El método `InsertarCliente` implementa:
- Recepción de datos del cliente como parámetros
- Validación de datos (lógica de negocio)
- Instanciación de la clase de acceso a datos
- Ejecución de sentencia SQL INSERT a través de la capa de datos

**Características:**
- Validación de campos obligatorios (nombre y apellido)
- Validación de formato de email
- Manejo de excepciones
- Sobrecarga de métodos (acepta parámetros individuales u objeto Cliente)

## Ejercicio 35: Clase Conexion

**Ubicación:** `Conexion.cs`

La clase `Conexion` implementa:
- Método `ObtenerConexion()` que devuelve un objeto `SqlConnection` configurado
- Cadena de conexión a SQL Server
- Bloque try-catch para capturar errores de conexión
- Método adicional `CerrarConexion()` para cerrar conexiones de forma segura

**Características:**
- Manejo de excepciones específicas de SQL Server (`SqlException`)
- Manejo de excepciones generales
- Mensajes informativos en consola
- Cierre seguro de conexiones

## Configuración

### Requisitos
- .NET Framework 4.5 o superior / .NET 5.0+
- SQL Server (LocalDB, Express, o versión completa)
- System.Data.SqlClient

### Configurar la Cadena de Conexión

Editar la cadena de conexión en `Conexion.cs`:

```csharp
private string cadenaConexion = @"Server=localhost;Database=MiBaseDatos;Integrated Security=true;";
```

Opciones de cadena de conexión:

**Con autenticación de Windows:**
```csharp
Server=localhost;Database=MiBaseDatos;Integrated Security=true;
```

**Con usuario y contraseña:**
```csharp
Server=localhost;Database=MiBaseDatos;User Id=usuario;Password=contraseña;
```

**Para SQL Server Express:**
```csharp
Server=localhost\\SQLEXPRESS;Database=MiBaseDatos;Integrated Security=true;
```

### Crear la Base de Datos

Ejecutar el siguiente script SQL para crear la tabla necesaria:

```sql
-- Crear la base de datos
CREATE DATABASE MiBaseDatos;
GO

USE MiBaseDatos;
GO

-- Crear la tabla Clientes
CREATE TABLE Clientes (
    IdCliente INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100),
    Telefono NVARCHAR(20),
    Direccion NVARCHAR(200),
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO
```

## Compilación y Ejecución

### Usando Visual Studio
1. Abrir la carpeta en Visual Studio
2. Agregar referencia a `System.Data.SqlClient` (si es necesario)
3. Compilar el proyecto (F6)
4. Ejecutar (F5 o Ctrl+F5)

### Usando línea de comandos (csc)

```bash
# Compilar todos los archivos
csc /out:AplicacionCliente.exe /reference:System.Data.dll Entidades\Cliente.cs Conexion.cs CapaDatos\DatosCliente.cs CapaLogica\LogicaCliente.cs Program.cs

# Ejecutar
AplicacionCliente.exe
```

### Usando .NET CLI

```bash
# Crear un proyecto de consola
dotnet new console -n ArquitecturaTresCapas

# Agregar los archivos al proyecto
# Copiar todos los archivos .cs al directorio del proyecto

# Agregar referencia a System.Data.SqlClient
dotnet add package System.Data.SqlClient

# Compilar y ejecutar
dotnet run
```

## Arquitectura de Tres Capas

### 1. Capa de Entidades
- Define las clases que representan las entidades del negocio
- `Cliente.cs`: Propiedades y estructura de datos del cliente

### 2. Capa de Datos (Data Access Layer - DAL)
- Maneja toda la interacción con la base de datos
- `Conexion.cs`: Gestión de conexiones a SQL Server
- `DatosCliente.cs`: Operaciones CRUD sobre la tabla Clientes
- Uso de parámetros SQL para prevenir SQL Injection

### 3. Capa de Lógica de Negocio (Business Logic Layer - BLL)
- Implementa las reglas de negocio
- `LogicaCliente.cs`: Validaciones y procesamiento de datos del cliente
- Actúa como intermediario entre la presentación y los datos

### 4. Capa de Presentación
- `Program.cs`: Interfaz de usuario (consola)
- Interactúa únicamente con la capa de lógica

## Ventajas de Esta Arquitectura

1. **Separación de responsabilidades**: Cada capa tiene un propósito específico
2. **Mantenibilidad**: Cambios en una capa no afectan a las demás
3. **Reutilización**: Las capas inferiores pueden ser utilizadas por múltiples capas superiores
4. **Testabilidad**: Cada capa puede ser probada independientemente
5. **Escalabilidad**: Facilita el crecimiento del sistema

## Flujo de Datos

```
Usuario → Program.cs (Presentación)
           ↓
        LogicaCliente.cs (Lógica)
           ↓
        DatosCliente.cs (Datos)
           ↓
        Conexion.cs → SQL Server
```

## Notas Importantes

- **Seguridad**: La cadena de conexión debe protegerse en producción (usar archivo de configuración cifrado)
- **Recursos**: Siempre cerrar conexiones y comandos SQL usando bloques `finally` o `using`
- **Validaciones**: Las validaciones de negocio deben estar en la capa de lógica
- **Parámetros SQL**: Siempre usar parámetros para prevenir SQL Injection

## Mejoras Sugeridas

1. Implementar patrón Repository
2. Usar Entity Framework en lugar de ADO.NET clásico
3. Implementar logging (log4net, Serilog)
4. Agregar pruebas unitarias
5. Implementar inyección de dependencias
6. Usar archivos de configuración (app.config o appsettings.json)
7. Implementar manejo de transacciones
8. Agregar interfaz gráfica (WinForms, WPF, o ASP.NET)

## Autor
Solución para los ejercicios 34 y 35 de Arquitectura de Software
