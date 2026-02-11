using ProductoApp.Application.Services;
using ProductoApp.Infrastructure.Repositories;
using MySql.Data.MySqlClient;

class Program
{
    static void Main()
    {
        string connectionString = "server=localhost;database=tienda;user=root;password=Komodino6664@;port=3306;";

        Console.WriteLine("╔═══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║           SISTEMA DE GESTIÓN DE PRODUCTOS                ║");
        Console.WriteLine("╚═══════════════════════════════════════════════════════════╝");
        
        // CONSULTAR PRODUCTOS
        ConsultarProductos(connectionString);
        
        // DESCONTAR STOCK
        var repository = new ProductoRepository(connectionString);
        var service = new ProductoService(repository);

        try
        {
            Console.Write("\n¿Desea descontar stock? (s/n): ");
            var respuesta = Console.ReadLine()?.ToLower();
            
            if (respuesta == "s")
            {
                Console.Write("ID del producto: ");
                int id = int.Parse(Console.ReadLine() ?? "1");
                
                Console.Write("Cantidad a descontar: ");
                int cantidad = int.Parse(Console.ReadLine() ?? "1");
                
                service.DescontarStock(id, cantidad);
                Console.WriteLine("\n✓ Inventario actualizado exitosamente.\n");
                
                ConsultarProductos(connectionString);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n⚠ Se produjo un problema: {ex.Message}\n");
        }
    }
    
    static void ConsultarProductos(string connectionString)
    {
        using var connection = new MySqlConnection(connectionString);
        connection.Open();

        var cmd = new MySqlCommand("SELECT id, nombre, precio, stock FROM producto", connection);
        
        using var reader = cmd.ExecuteReader();
        
        Console.WriteLine("\n╔════╦═══════════════════════╦══════════╦══════════════════╗");
        Console.WriteLine("║ ID ║ NOMBRE                ║ PRECIO   ║ STOCK            ║");
        Console.WriteLine("╠════╬═══════════════════════╬══════════╬══════════════════╣");
        
        while (reader.Read())
        {
            Console.WriteLine($"║ {reader.GetInt32(0),-2} ║ {reader.GetString(1),-21} ║ ${reader.GetDecimal(2),-8:F2} ║ {reader.GetInt32(3),-16} ║");
        }
        
        Console.WriteLine("╚════╩═══════════════════════╩══════════╩══════════════════╝");
    }
}