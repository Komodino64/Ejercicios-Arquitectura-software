namespace ProductoApp.Domain.Entities
{
    public class Producto
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public decimal Precio { get; private set; }
        public int Stock { get; private set; }

        public Producto(int id, string nombre, decimal precio, int stock)
        {
            Id = id;
            Nombre = nombre;
            Precio = precio;
            Stock = stock;
        }

        public void DescontarStock(int cantidad)
        {
            if (cantidad <= 0)
                throw new DomainException("La cantidad ingresada no es válida (debe ser mayor a cero).");

            if (Stock - cantidad < 0)
                throw new DomainException("No hay suficientes unidades disponibles en el inventario.");

            Stock -= cantidad;
        }
    }
}