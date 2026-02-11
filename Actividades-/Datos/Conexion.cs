using System;
using MySqlConnector;

namespace ArquitecturaSoftware.Datos
{
    public class Conexion
    {
        // Ajusta estos valores a tu instalación de MySQL.
        // Recomendación: no hardcodear contraseña en proyectos reales.
        private readonly string _cadena = "Server=localhost;Port=3306;Database=MiDB;Uid=root;Pwd=TU_PASSWORD;";

        public MySqlConnection ObtenerConexion()
        {
            try
            {
                var conn = new MySqlConnection(_cadena);
                conn.Open();
                return conn;
            }
            catch (Exception ex)
            {
                throw new Exception("Error de conexión a la base de datos.", ex);
            }
        }
    }
}
