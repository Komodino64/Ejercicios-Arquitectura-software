-- Script SQL para MySQL
-- Ejercicios 34 y 35 - Arquitectura a Tres Capas

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS MiBaseDatos;

-- Usar la base de datos
USE MiBaseDatos;

-- Crear la tabla Clientes
CREATE TABLE IF NOT EXISTS Clientes (
    IdCliente INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Telefono VARCHAR(20),
    Direccion VARCHAR(200),
    FechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO Clientes (Nombre, Apellido, Email, Telefono, Direccion)
VALUES 
    ('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '555-1111', 'Calle 1 #100'),
    ('Ana', 'Martínez', 'ana.martinez@email.com', '555-2222', 'Carrera 2 #200'),
    ('Luis', 'García', 'luis.garcia@email.com', '555-3333', 'Avenida 3 #300');

-- Consultar los datos
SELECT * FROM Clientes;
