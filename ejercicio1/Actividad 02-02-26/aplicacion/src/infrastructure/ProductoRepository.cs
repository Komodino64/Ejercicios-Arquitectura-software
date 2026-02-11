using MySql.Data.MySqlClient;
using ProductoApp.Application.Interfaces;
using ProductoApp.Domain.Entities;

namespace ProductoApp.Infrastructure.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly string _connectionString;

        public ProductoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public Producto ObtenerPorId(int id)
        {
            using var connection = new MySqlConnection(_connectionString);
            connection.Open();

            var cmd = new MySqlCommand(
                "SELECT id, nombre, precio, stock FROM producto WHERE id = @id",
                connection
            );
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = cmd.ExecuteReader();
            if (!reader.Read())
                throw new Exception("No se encontró el producto solicitado en la base de datos.");

            return new Producto(
                reader.GetInt32("id"),
                reader.GetString("nombre"),
                reader.GetDecimal("precio"),
                reader.GetInt32("stock")
            );
        }

        public void Guardar(Producto producto)
        {
            using var connection = new MySqlConnection(_connectionString);
            connection.Open();

            var cmd = new MySqlCommand(
                @"UPDATE producto 
                  SET nombre = @nombre, precio = @precio, stock = @stock 
                  WHERE id = @id",
                connection
            );

            cmd.Parameters.AddWithValue("@id", producto.Id);
            cmd.Parameters.AddWithValue("@nombre", producto.Nombre);
            cmd.Parameters.AddWithValue("@precio", producto.Precio);
            cmd.Parameters.AddWithValue("@stock", producto.Stock);

            cmd.ExecuteNonQuery();
        }

        public void Eliminar(int id)
        {
            using var connection = new MySqlConnection(_connectionString);
            connection.Open();

            var cmd = new MySqlCommand(
                "DELETE FROM producto WHERE id = @id",
                connection
            );
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();
        }
    }
}
