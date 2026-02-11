using System.ComponentModel.DataAnnotations;

namespace ImperialLuxuryCars.Models
{
    public class ContactMessage
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "El nombre es requerido")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El teléfono es requerido")]
        public string Phone { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El mensaje es requerido")]
        public string Message { get; set; } = string.Empty;
        
        public int? CarId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
