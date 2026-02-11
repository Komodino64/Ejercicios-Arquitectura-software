# ================================================================================
#         COMANDOS ACTUALIZADOS PARA MYSQL (Windows)
# ================================================================================

# PASO 1: Ir a la carpeta del proyecto
cd "c:\arquitectura-software-main\ejercicios 34 y 35"

# PASO 2: Crear la base de datos en MySQL
# Opción A - Si tienes mysql.exe en el PATH:
mysql -u root -p < ScriptMySQL.sql

# Opción B - Sin contraseña (por defecto en XAMPP/WAMP):
mysql -u root < ScriptMySQL.sql

# Opción C - Ruta completa de MySQL (XAMPP):
& "C:\xampp\mysql\bin\mysql.exe" -u root < ScriptMySQL.sql

# Opción D - Ruta completa de MySQL (MySQL Installer):
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < ScriptMySQL.sql


# PASO 3: Descargar el conector MySQL para .NET
# Ve a: https://dev.mysql.com/downloads/connector/net/
# O ejecuta:
Invoke-WebRequest -Uri "https://dev.mysql.com/get/Downloads/Connector-Net/mysql-connector-net-8.0.33.msi" -OutFile "mysql-connector.msi"
Start-Process "mysql-connector.msi"

# Después de instalar, la DLL estará en:
# C:\Program Files (x86)\MySQL\MySQL Connector NET 8.0\Assemblies\v4.5.2\MySql.Data.dll


# PASO 4: Compilar la aplicación con ruta completa de csc
# Framework 64 bits:
& "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /out:ClienteApp.exe /reference:"C:\Program Files (x86)\MySQL\MySQL Connector NET 8.0\Assemblies\v4.5.2\MySql.Data.dll" Entidades\Cliente.cs Conexion.cs CapaDatos\DatosCliente.cs CapaLogica\LogicaCliente.cs ProgramInteractivo.cs

# Si no tienes el conector instalado, usa NuGet:
nuget install MySql.Data -OutputDirectory packages
& "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /out:ClienteApp.exe /reference:"packages\MySql.Data.8.0.33\lib\net452\MySql.Data.dll" Entidades\Cliente.cs Conexion.cs CapaDatos\DatosCliente.cs CapaLogica\LogicaCliente.cs ProgramInteractivo.cs


# PASO 5: Ejecutar la aplicación
.\ClienteApp.exe


# PASO 6: Verificar datos en MySQL
mysql -u root -e "USE MiBaseDatos; SELECT * FROM Clientes;"

# O con ruta completa:
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "USE MiBaseDatos; SELECT * FROM Clientes;"


# ================================================================================
#         SOLUCIÓN ALTERNATIVA: USAR VISUAL STUDIO O DOTNET CLI
# ================================================================================

# Si tienes Visual Studio o .NET SDK instalado:

# Crear proyecto de consola
dotnet new console -n ClienteApp

# Copiar archivos al proyecto
Copy-Item -Path "*.cs" -Destination "ClienteApp\" -Recurse
Copy-Item -Path "Entidades" -Destination "ClienteApp\" -Recurse
Copy-Item -Path "CapaDatos" -Destination "ClienteApp\" -Recurse
Copy-Item -Path "CapaLogica" -Destination "ClienteApp\" -Recurse

# Agregar paquete MySQL
cd ClienteApp
dotnet add package MySql.Data

# Compilar y ejecutar
dotnet run


# ================================================================================
#         VERIFICAR QUE MYSQL ESTÁ CORRIENDO
# ================================================================================

Get-Service | Where-Object {$_.DisplayName -like "*MySQL*"}

# Si no está corriendo, iniciarlo:
Start-Service MySQL80

# O desde Services:
services.msc
