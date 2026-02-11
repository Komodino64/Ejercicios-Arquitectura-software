using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ImperialLuxuryCars.Models;
using ImperialLuxuryCars.Data;

namespace ImperialLuxuryCars.Pages
{
    [Authorize(Roles = "Admin")]
    public class AdminModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public AdminModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Car> Cars { get; set; } = new();
        public List<ContactMessage> Messages { get; set; } = new();
        public int TotalCars { get; set; }
        public int AvailableCars { get; set; }
        public int PendingMessages { get; set; }

        public async Task OnGetAsync()
        {
            Cars = await _context.Cars.OrderByDescending(c => c.Id).ToListAsync();
            Messages = await _context.ContactMessages.OrderByDescending(m => m.CreatedAt).Take(5).ToListAsync();
            
            TotalCars = Cars.Count;
            AvailableCars = Cars.Count(c => c.Status == "Disponible");
            PendingMessages = await _context.ContactMessages.CountAsync();
        }
    }
}
