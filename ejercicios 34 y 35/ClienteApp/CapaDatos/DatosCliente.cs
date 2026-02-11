using System;
using MySql.Data.MySqlClient;
using Entidades;

namespace CapaDatos
{
    /// <summary>
    /// Capa de Datos - Clase para acceso a datos de Cliente (Enfoque Clásico ADO.NET)
    /// </summary>
    public class DatosCliente
    {
        private Conexion conexion;

        // Constructor
        public DatosCliente()
        {
            conexion = new Conexion();
        }

        /// <summary>
        /// Método para insertar un cliente en la base de datos
        /// </summary>
        /// <param name="cliente">Objeto cliente con los datos a insertar</param>
        /// <returns>True si se insertó correctamente, False en caso contrario</returns>
        public bool Insertar(Cliente cliente)
        {
            MySqlConnection conn = null;
            MySqlCommand cmd = null;

            try
            {
                // Obtener la conexión
                conn = conexion.ObtenerConexion();

                // Crear la sentencia SQL INSERT
                string sql = @"INSERT INTO Clientes (Nombre, Apellido, Email, Telefono, Direccion, FechaRegistro) 
                              VALUES (@Nombre, @Apellido, @Email, @Telefono, @Direccion, @FechaRegistro)";

                // Crear el comando SQL
                cmd = new MySqlCommand(sql, conn);

                // Agregar parámetros para evitar SQL Injection
                cmd.Parameters.AddWithValue("@Nombre", cliente.Nombre);
                cmd.Parameters.AddWithValue("@Apellido", cliente.Apellido);
                cmd.Parameters.AddWithValue("@Email", cliente.Email ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Telefono", cliente.Telefono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Direccion", cliente.Direccion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaRegistro", cliente.FechaRegistro);

                // Ejecutar la sentencia SQL
                int filasAfectadas = cmd.ExecuteNonQuery();

                // Verificar si se insertó correctamente
                if (filasAfectadas > 0)
                {
                    Console.WriteLine("Cliente insertado correctamente en la base de datos.");
                    return true;
                }
                else
                {
                    Console.WriteLine("No se pudo insertar el cliente.");
                    return false;
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al insertar cliente: {ex.Message}");
                throw new Exception("Error al insertar el cliente en la base de datos.", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al insertar cliente: {ex.Message}");
                throw new Exception("Error al procesar la inserción del cliente.", ex);
            }
            finally
            {
                // Cerrar recursos
                if (cmd != null)
                    cmd.Dispose();

                if (conn != null)
                    conexion.CerrarConexion(conn);
            }
        }

        /// <summary>
        /// Método adicional para actualizar un cliente
        /// </summary>
        public bool Actualizar(Cliente cliente)
        {
            MySqlConnection conn = null;
            MySqlCommand cmd = null;

            try
            {
                conn = conexion.ObtenerConexion();

                string sql = @"UPDATE Clientes 
                              SET Nombre = @Nombre, Apellido = @Apellido, Email = @Email, 
                                  Telefono = @Telefono, Direccion = @Direccion 
                              WHERE IdCliente = @IdCliente";

                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@IdCliente", cliente.IdCliente);
                cmd.Parameters.AddWithValue("@Nombre", cliente.Nombre);
                cmd.Parameters.AddWithValue("@Apellido", cliente.Apellido);
                cmd.Parameters.AddWithValue("@Email", cliente.Email ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Telefono", cliente.Telefono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Direccion", cliente.Direccion ?? (object)DBNull.Value);

                return cmd.ExecuteNonQuery() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar cliente: {ex.Message}");
                throw;
            }
            finally
            {
                if (cmd != null) cmd.Dispose();
                if (conn != null) conexion.CerrarConexion(conn);
            }
        }

        /// <summary>
        /// Método adicional para eliminar un cliente
        /// </summary>
        public bool Eliminar(int idCliente)
        {
            MySqlConnection conn = null;
            MySqlCommand cmd = null;

            try
            {
                conn = conexion.ObtenerConexion();

                string sql = "DELETE FROM Clientes WHERE IdCliente = @IdCliente";

                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@IdCliente", idCliente);

                return cmd.ExecuteNonQuery() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al eliminar cliente: {ex.Message}");
                throw;
            }
            finally
            {
                if (cmd != null) cmd.Dispose();
                if (conn != null) conexion.CerrarConexion(conn);
            }
        }
    }
}
