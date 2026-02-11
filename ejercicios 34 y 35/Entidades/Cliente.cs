using System;

namespace Entidades
{
    /// <summary>
    /// Clase entidad Cliente - representa la estructura de datos del cliente
    /// </summary>
    public class Cliente
    {
        // Propiedades del cliente
        public int IdCliente { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public DateTime FechaRegistro { get; set; }

        // Constructor vacío
        public Cliente()
        {
            FechaRegistro = DateTime.Now;
        }

        // Constructor con parámetros
        public Cliente(string nombre, string apellido, string email, string telefono, string direccion)
        {
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            Telefono = telefono;
            Direccion = direccion;
            FechaRegistro = DateTime.Now;
        }
    }
}
