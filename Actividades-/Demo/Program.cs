using System;
using System.Data;
using ArquitecturaSoftware.Logica;

namespace ArquitecturaSoftware.Demo
{
    internal static class Program
    {
        private static void Main()
        {
            // 1) Inserta un cliente
            var logica = new Cliente();
            logica.InsertarCliente("Juan Perez", "juan@correo.com", "555-123");

            // 2) Muestra clientes
            DataTable tabla = logica.ObtenerClientes();
            Console.WriteLine($"Clientes encontrados: {tabla.Rows.Count}");
            foreach (DataRow row in tabla.Rows)
            {
                Console.WriteLine($"{row["Id"]}: {row["Nombre"]} - {row["Correo"]} - {row["Telefono"]}");
            }
        }
    }
}
