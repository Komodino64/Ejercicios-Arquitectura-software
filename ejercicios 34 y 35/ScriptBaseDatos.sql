-- Script SQL para crear la base de datos y tabla necesaria
-- Ejercicios 34 y 35 - Arquitectura a Tres Capas

-- Crear la base de datos
CREATE DATABASE MiBaseDatos;
GO

-- Usar la base de datos
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

-- Insertar datos de prueba
INSERT INTO Clientes (Nombre, Apellido, Email, Telefono, Direccion)
VALUES 
    ('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '555-1111', 'Calle 1 #100'),
    ('Ana', 'Martínez', 'ana.martinez@email.com', '555-2222', 'Carrera 2 #200'),
    ('Luis', 'García', 'luis.garcia@email.com', '555-3333', 'Avenida 3 #300');
GO

-- Consultar los datos
SELECT * FROM Clientes;
GO
