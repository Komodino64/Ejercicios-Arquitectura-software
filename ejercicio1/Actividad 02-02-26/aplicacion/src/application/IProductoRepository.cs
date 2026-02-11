using ProductoApp.Domain.Entities;

namespace ProductoApp.Application.Interfaces
{
    public interface IProductoRepository
    {
        Producto ObtenerPorId(int id);
        void Guardar(Producto producto);
        void Eliminar(int id);
    }
}
