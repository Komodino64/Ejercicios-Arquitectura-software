using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ImperialLuxuryCars.Models;
using ImperialLuxuryCars.Data;

namespace ImperialLuxuryCars.Pages
{
    public class ContactModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public ContactModel(ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public ContactMessage ContactMessage { get; set; } = default!;

        public Car? Car { get; set; }

        [TempData]
        public string? Message { get; set; }

        public async Task OnGetAsync(int? carId)
        {
            if (carId.HasValue)
            {
                Car = await _context.Cars.FindAsync(carId.Value);
                ContactMessage = new ContactMessage { CarId = carId.Value };
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                if (ContactMessage.CarId.HasValue)
                {
                    Car = await _context.Cars.FindAsync(ContactMessage.CarId.Value);
                }
                return Page();
            }

            ContactMessage.CreatedAt = DateTime.Now;
            _context.ContactMessages.Add(ContactMessage);
            await _context.SaveChangesAsync();

            Message = "¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.";
            return RedirectToPage("/Index");
        }
    }
}
