using System.ComponentModel.DataAnnotations;

namespace ImperialLuxuryCars.Models
{
    public class Car
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "La marca es requerida")]
        public string Brand { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El modelo es requerido")]
        public string Model { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El año es requerido")]
        [Range(1900, 2030, ErrorMessage = "El año debe estar entre 1900 y 2030")]
        public int Year { get; set; }
        
        [Required(ErrorMessage = "El precio es requerido")]
        [Range(0, 10000000, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Price { get; set; }
        
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "La descripción es requerida")]
        public string Description { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Disponible";
        
        [Required(ErrorMessage = "El kilometraje es requerido")]
        [Range(0, 1000000, ErrorMessage = "El kilometraje debe ser mayor o igual a 0")]
        public int Mileage { get; set; }
        
        [Required(ErrorMessage = "El color es requerido")]
        public string Color { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El tipo de combustible es requerido")]
        public string FuelType { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El tipo de transmisión es requerido")]
        public string Transmission { get; set; } = string.Empty;
    }
}
