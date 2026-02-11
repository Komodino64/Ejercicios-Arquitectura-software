using System;
using CapaDatos;
using Entidades;

namespace CapaLogica
{
    /// <summary>
    /// Capa de Lógica de Negocio - Clase Cliente (Ejercicio 34)
    /// </summary>
    public class LogicaCliente
    {
        private DatosCliente datosCliente;

        // Constructor
        public LogicaCliente()
        {
            datosCliente = new DatosCliente();
        }

        /// <summary>
        /// Método InsertarCliente - Recibe los datos del cliente, instancia la clase de acceso a datos
        /// y ejecuta la sentencia SQL INSERT (Ejercicio 34)
        /// </summary>
        /// <param name="nombre">Nombre del cliente</param>
        /// <param name="apellido">Apellido del cliente</param>
        /// <param name="email">Email del cliente</param>
        /// <param name="telefono">Teléfono del cliente</param>
        /// <param name="direccion">Dirección del cliente</param>
        /// <returns>True si se insertó correctamente, False en caso contrario</returns>
        public bool InsertarCliente(string nombre, string apellido, string email, string telefono, string direccion)
        {
            try
            {
                // Validar los datos del cliente (lógica de negocio)
                if (string.IsNullOrWhiteSpace(nombre))
                {
                    throw new ArgumentException("El nombre del cliente es obligatorio.");
                }

                if (string.IsNullOrWhiteSpace(apellido))
                {
                    throw new ArgumentException("El apellido del cliente es obligatorio.");
                }

                // Validar formato de email
                if (!string.IsNullOrWhiteSpace(email) && !EsEmailValido(email))
                {
                    throw new ArgumentException("El formato del email no es válido.");
                }

                // Crear el objeto Cliente con los datos recibidos
                Cliente cliente = new Cliente
                {
                    Nombre = nombre.Trim(),
                    Apellido = apellido.Trim(),
                    Email = email?.Trim(),
                    Telefono = telefono?.Trim(),
                    Direccion = direccion?.Trim(),
                    FechaRegistro = DateTime.Now
                };

                // Instanciar la clase de acceso a datos (si no se hizo en el constructor)
                // DatosCliente datosCliente = new DatosCliente();

                // Ejecutar la sentencia SQL INSERT a través de la capa de datos
                bool resultado = datosCliente.Insertar(cliente);

                if (resultado)
                {
                    Console.WriteLine("Cliente insertado exitosamente.");
                }
                else
                {
                    Console.WriteLine("No se pudo insertar el cliente.");
                }

                return resultado;
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Error de validación: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al insertar cliente: {ex.Message}");
                throw new Exception("Error en la capa de lógica al insertar el cliente.", ex);
            }
        }

        /// <summary>
        /// Sobrecarga del método InsertarCliente que recibe un objeto Cliente
        /// </summary>
        /// <param name="cliente">Objeto Cliente con los datos</param>
        /// <returns>True si se insertó correctamente, False en caso contrario</returns>
        public bool InsertarCliente(Cliente cliente)
        {
            try
            {
                // Validar el objeto cliente
                if (cliente == null)
                {
                    throw new ArgumentNullException(nameof(cliente), "El objeto cliente no puede ser nulo.");
                }

                // Validar los datos del cliente
                if (string.IsNullOrWhiteSpace(cliente.Nombre))
                {
                    throw new ArgumentException("El nombre del cliente es obligatorio.");
                }

                if (string.IsNullOrWhiteSpace(cliente.Apellido))
                {
                    throw new ArgumentException("El apellido del cliente es obligatorio.");
                }

                // Validar email
                if (!string.IsNullOrWhiteSpace(cliente.Email) && !EsEmailValido(cliente.Email))
                {
                    throw new ArgumentException("El formato del email no es válido.");
                }

                // Ejecutar la inserción a través de la capa de datos
                bool resultado = datosCliente.Insertar(cliente);

                return resultado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al insertar cliente: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Método auxiliar para validar el formato del email
        /// </summary>
        private bool EsEmailValido(string email)
        {
            try
            {
                var direccion = new System.Net.Mail.MailAddress(email);
                return direccion.Address == email;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Método adicional para actualizar un cliente
        /// </summary>
        public bool ActualizarCliente(Cliente cliente)
        {
            try
            {
                if (cliente == null)
                {
                    throw new ArgumentNullException(nameof(cliente));
                }

                if (cliente.IdCliente <= 0)
                {
                    throw new ArgumentException("El ID del cliente debe ser mayor a cero.");
                }

                return datosCliente.Actualizar(cliente);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar cliente: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Método adicional para eliminar un cliente
        /// </summary>
        public bool EliminarCliente(int idCliente)
        {
            try
            {
                if (idCliente <= 0)
                {
                    throw new ArgumentException("El ID del cliente debe ser mayor a cero.");
                }

                return datosCliente.Eliminar(idCliente);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al eliminar cliente: {ex.Message}");
                throw;
            }
        }
    }
}
