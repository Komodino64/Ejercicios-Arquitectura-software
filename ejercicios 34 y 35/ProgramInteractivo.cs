using System;
using CapaLogica;
using Entidades;

namespace AplicacionCliente
{
    class ProgramInteractivo
    {
        static void Main(string[] args)
        {
            Console.WriteLine("╔════════════════════════════════════════════╗");
            Console.WriteLine("║  SISTEMA DE GESTIÓN DE CLIENTES           ║");
            Console.WriteLine("║  Arquitectura a Tres Capas - ADO.NET      ║");
            Console.WriteLine("╚════════════════════════════════════════════╝\n");

            // Crear la base de datos si no existe
            Console.WriteLine("Inicializando base de datos...");
            CapaDatos.Conexion conexionInicial = new CapaDatos.Conexion();
            conexionInicial.CrearBaseDatos();
            Console.WriteLine();

            LogicaCliente logicaCliente = new LogicaCliente();
            bool continuar = true;

            while (continuar)
            {
                try
                {
                    Console.WriteLine("\n┌─────────────────────────────────────┐");
                    Console.WriteLine("│  INGRESE LOS DATOS DEL CLIENTE     │");
                    Console.WriteLine("└─────────────────────────────────────┘");

                    // Capturar datos del usuario
                    Console.Write("\nNombre: ");
                    string nombre = Console.ReadLine();

                    Console.Write("Apellido: ");
                    string apellido = Console.ReadLine();

                    Console.Write("Email: ");
                    string email = Console.ReadLine();

                    Console.Write("Teléfono: ");
                    string telefono = Console.ReadLine();

                    Console.Write("Dirección: ");
                    string direccion = Console.ReadLine();

                    Console.WriteLine("\n⏳ Insertando cliente en la base de datos...\n");

                    // Insertar cliente
                    bool resultado = logicaCliente.InsertarCliente(
                        nombre, 
                        apellido, 
                        email, 
                        telefono, 
                        direccion
                    );

                    if (resultado)
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine("✓ ¡Cliente insertado exitosamente!");
                        Console.ResetColor();
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("✗ No se pudo insertar el cliente.");
                        Console.ResetColor();
                    }

                    // Preguntar si desea continuar
                    Console.Write("\n¿Desea insertar otro cliente? (S/N): ");
                    string respuesta = Console.ReadLine()?.ToUpper();
                    continuar = (respuesta == "S" || respuesta == "SI");
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"\n✗ Error: {ex.Message}");
                    Console.ResetColor();

                    Console.Write("\n¿Desea intentar de nuevo? (S/N): ");
                    string respuesta = Console.ReadLine()?.ToUpper();
                    continuar = (respuesta == "S" || respuesta == "SI");
                }
            }

            Console.WriteLine("\n╔════════════════════════════════════════════╗");
            Console.WriteLine("║  Gracias por usar el sistema              ║");
            Console.WriteLine("╚════════════════════════════════════════════╝");
            Console.WriteLine("\nPresione cualquier tecla para salir...");
            Console.ReadKey();
        }
    }
}
