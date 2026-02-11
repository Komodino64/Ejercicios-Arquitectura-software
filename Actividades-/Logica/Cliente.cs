using ArquitecturaSoftware.Datos;
using System.Data;

namespace ArquitecturaSoftware.Logica
{
    public class Cliente
    {
        public void InsertarCliente(string nombre, string correo, string telefono)
        {
            var acceso = new ClienteDatos();
            string sql = "INSERT INTO Clientes (Nombre, Correo, Telefono) VALUES (@Nombre, @Correo, @Telefono)";
            acceso.EjecutarInsert(sql, nombre, correo, telefono);
        }

        public DataTable ObtenerClientes()
        {
            var acceso = new ClienteDatos();
            return acceso.ObtenerTodos();
        }
    }
}
