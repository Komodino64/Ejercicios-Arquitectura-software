using ArquitecturaSoftware.Dominio;

namespace ArquitecturaSoftware.Aplicacion
{
    public class VenderProductoUseCase
    {
        private readonly IProductoRepository _repo;

        public VenderProductoUseCase(IProductoRepository repo)
        {
            _repo = repo;
        }

        public void Ejecutar(int idProducto, int cantidad)
        {
            var producto = _repo.ObtenerPorId(idProducto);
            if (producto == null)
            {
                throw new DomainException("Producto no existe.");
            }

            producto.DescontarStock(cantidad);
            _repo.Guardar(producto);
        }
    }
}
