using System.Data;
using MySqlConnector;

namespace ArquitecturaSoftware.Datos
{
    public class ClienteDatos
    {
        private readonly Conexion _conexion = new Conexion();

        public void EjecutarInsert(string sql, string nombre, string correo, string telefono)
        {
            using (MySqlConnection conn = _conexion.ObtenerConexion())
            using (MySqlCommand cmd = new MySqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@Nombre", nombre);
                cmd.Parameters.AddWithValue("@Correo", correo);
                cmd.Parameters.AddWithValue("@Telefono", telefono);
                cmd.ExecuteNonQuery();
            }
        }

        public DataTable ObtenerTodos()
        {
            const string sql = "SELECT Id, Nombre, Correo, Telefono FROM Clientes ORDER BY Id DESC";

            using (MySqlConnection conn = _conexion.ObtenerConexion())
            using (MySqlCommand cmd = new MySqlCommand(sql, conn))
            using (var reader = cmd.ExecuteReader())
            {
                var table = new DataTable();
                table.Load(reader);
                return table;
            }
        }
    }
}
