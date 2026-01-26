-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS estudiantes;

-- Usar la base de datos
USE estudiantes;

-- Crear tabla de estudiantes
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);