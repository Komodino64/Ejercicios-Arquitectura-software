namespace ArquitecturaSoftware.Dominio
{
    public interface IProductoRepository
    {
        Producto ObtenerPorId(int id);
        void Guardar(Producto producto);
        void Eliminar(int id);
    }
}
