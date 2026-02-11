using System;
using CapaLogica;
using Entidades;

namespace AplicacionCliente
{
    /// <summary>
    /// Programa principal para demostrar el uso de la arquitectura de tres capas
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== ARQUITECTURA DE SOFTWARE A TRES CAPAS ===");
            Console.WriteLine("=== Ejercicios 34 y 35 ===\n");

            try
            {
                // Crear instancia de la capa de lógica
                LogicaCliente logicaCliente = new LogicaCliente();

                // EJEMPLO 1: Insertar cliente usando parámetros individuales
                Console.WriteLine("--- Ejemplo 1: Insertar cliente con parámetros ---");
                bool resultado1 = logicaCliente.InsertarCliente(
                    nombre: "Juan",
                    apellido: "Pérez",
                    email: "juan.perez@email.com",
                    telefono: "555-1234",
                    direccion: "Calle Principal 123"
                );

                if (resultado1)
                {
                    Console.WriteLine("✓ Cliente insertado exitosamente.\n");
                }

                // EJEMPLO 2: Insertar cliente usando un objeto Cliente
                Console.WriteLine("--- Ejemplo 2: Insertar cliente con objeto ---");
                Cliente nuevoCliente = new Cliente
                {
                    Nombre = "María",
                    Apellido = "González",
                    Email = "maria.gonzalez@email.com",
                    Telefono = "555-5678",
                    Direccion = "Avenida Central 456"
                };

                bool resultado2 = logicaCliente.InsertarCliente(nuevoCliente);

                if (resultado2)
                {
                    Console.WriteLine("✓ Cliente insertado exitosamente.\n");
                }

                // EJEMPLO 3: Intentar insertar con datos inválidos (para demostrar validación)
                Console.WriteLine("--- Ejemplo 3: Validación de datos ---");
                try
                {
                    logicaCliente.InsertarCliente("", "Apellido", "email@test.com", "", "");
                }
                catch (ArgumentException ex)
                {
                    Console.WriteLine($"✓ Validación funcionando: {ex.Message}\n");
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n✗ Error: {ex.Message}");
                Console.WriteLine($"Detalles: {ex.InnerException?.Message}");
            }

            Console.WriteLine("\n=== Fin del programa ===");
            Console.WriteLine("Presione cualquier tecla para salir...");
            Console.ReadKey();
        }
    }
}
