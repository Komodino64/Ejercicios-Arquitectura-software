using ArquitecturaSoftware.Aplicacion;
using Microsoft.AspNetCore.Mvc;

namespace ArquitecturaSoftware.Presentacion
{
    [ApiController]
    [Route("api/productos")]
    public class ProductoController : ControllerBase
    {
        private readonly VenderProductoUseCase _useCase;

        public ProductoController(VenderProductoUseCase useCase)
        {
            _useCase = useCase;
        }

        public class VenderProductoRequest
        {
            public int IdProducto { get; set; }
            public int Cantidad { get; set; }
        }

        [HttpPost("vender")]
        public IActionResult Vender([FromBody] VenderProductoRequest req)
        {
            _useCase.Ejecutar(req.IdProducto, req.Cantidad);
            return Ok();
        }
    }
}
