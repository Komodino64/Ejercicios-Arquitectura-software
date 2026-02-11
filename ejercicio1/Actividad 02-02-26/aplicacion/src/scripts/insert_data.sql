-- Insertar datos de prueba en la tabla producto
USE tienda;

-- Limpiar datos existentes (opcional)
-- DELETE FROM producto;

-- Insertar productos de ejemplo
INSERT INTO producto (nombre, precio, stock) VALUES 
('Laptop HP', 1500.00, 10),
('Mouse Logitech', 25.50, 50),
('Teclado Mecánico', 89.99, 30),
('Monitor 24 pulgadas', 250.00, 15),
('Webcam HD', 45.00, 20);

-- Verificar los datos insertados
SELECT * FROM producto;
