using ProductoApp.Application.Interfaces;
using ProductoApp.Domain.Entities;

namespace ProductoApp.Application.Services
{
    public class ProductoService
    {
        private readonly IProductoRepository _repository;

        public ProductoService(IProductoRepository repository)
        {
            _repository = repository;
        }

        public void DescontarStock(int productoId, int cantidad)
        {
            var producto = _repository.ObtenerPorId(productoId);
            producto.DescontarStock(cantidad);
            _repository.Guardar(producto);
        }
    }
}
