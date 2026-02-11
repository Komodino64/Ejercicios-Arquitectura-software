using System;
using MySql.Data.MySqlClient;

namespace CapaDatos
{
    /// <summary>
    /// Clase de conexión para manejar la conexión a MySQL (Ejercicio 35)
    /// </summary>
    public class Conexion
    {
        // Cadena de conexión a MySQL
        // NOTA: Ajustar según su configuración de MySQL
        // Primero intentamos conectar sin BD para crearla si no existe
        private string cadenaConexionBase = @"Server=localhost;Uid=root;Pwd=root;";
        private string cadenaConexion = @"Server=localhost;Database=MiBaseDatos;Uid=root;Pwd=root;";
        // CAMBIA "root" en Pwd= si tienes otra contraseña en MySQL

        public void CrearBaseDatos()
        {
            MySqlConnection conn = null;
            try
            {
                conn = new MySqlConnection(cadenaConexionBase);
                conn.Open();
                
                MySqlCommand cmd = new MySqlCommand(@"
                    CREATE DATABASE IF NOT EXISTS MiBaseDatos;
                    USE MiBaseDatos;
                    CREATE TABLE IF NOT EXISTS Clientes (
                        IdCliente INT PRIMARY KEY AUTO_INCREMENT,
                        Nombre VARCHAR(100) NOT NULL,
                        Apellido VARCHAR(100) NOT NULL,
                        Email VARCHAR(100),
                        Telefono VARCHAR(20),
                        Direccion VARCHAR(200),
                        FechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );", conn);
                    
                cmd.ExecuteNonQuery();
                Console.WriteLine("Base de datos y tabla creadas correctamente.");
                conn.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al crear BD: {ex.Message}");
            }
            finally
            {
                if (conn != null) conn.Close();
            }
        }

        /// <summary>
        /// Método para obtener un objeto MySqlConnection configurado
        /// </summary>
        /// <returns>Objeto MySqlConnection abierto</returns>
        public MySqlConnection ObtenerConexion()
        {
            MySqlConnection conexion = null;

            try
            {
                // Crear la instancia de MySqlConnection con la cadena de conexión
                conexion = new MySqlConnection(cadenaConexion);
                
                // Abrir la conexión
                conexion.Open();
                
                Console.WriteLine("Conexión establecida correctamente.");
                
                return conexion;
            }
            catch (MySqlException ex)
            {
                // Capturar errores específicos de MySQL
                Console.WriteLine($"Error de MySQL: {ex.Message}");
                Console.WriteLine($"Número de error: {ex.Number}");
                throw new Exception("No se pudo establecer la conexión con la base de datos.", ex);
            }
            catch (Exception ex)
            {
                // Capturar cualquier otro tipo de error
                Console.WriteLine($"Error general: {ex.Message}");
                throw new Exception("Error al intentar conectar con la base de datos.", ex);
            }
        }

        /// <summary>
        /// Método para cerrar la conexión de forma segura
        /// </summary>
        /// <param name="conexion">Conexión a cerrar</param>
        public void CerrarConexion(MySqlConnection conexion)
        {
            try
            {
                if (conexion != null && conexion.State == System.Data.ConnectionState.Open)
                {
                    conexion.Close();
                    Console.WriteLine("Conexión cerrada correctamente.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al cerrar la conexión: {ex.Message}");
            }
        }
    }
}
