using ArquitecturaSoftware.Dominio;
using Microsoft.EntityFrameworkCore;

namespace ArquitecturaSoftware.Infraestructura
{
    public class ProductoRepositorySQL : IProductoRepository
    {
        private readonly DbContext _context;

        public ProductoRepositorySQL(DbContext context)
        {
            _context = context;
        }

        public Producto ObtenerPorId(int id)
        {
            return _context.Set<Producto>().Find(id);
        }

        public void Guardar(Producto producto)
        {
            _context.Update(producto);
            _context.SaveChanges();
        }

        public void Eliminar(int id)
        {
            var p = ObtenerPorId(id);
            if (p == null) return;
            _context.Remove(p);
            _context.SaveChanges();
        }
    }
}
