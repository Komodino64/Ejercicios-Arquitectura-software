using ArquitecturaSoftware.Dominio;

namespace ArquitecturaSoftware.Presentacion
{
    public static class ProductoMapper
    {
        public static ProductoDTO ToDTO(this Producto producto)
        {
            return new ProductoDTO
            {
                Nombre = producto.Nombre,
                Precio = producto.Precio
            };
        }
    }
}
