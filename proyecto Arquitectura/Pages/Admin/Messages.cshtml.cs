using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ImperialLuxuryCars.Models;
using ImperialLuxuryCars.Data;

namespace ImperialLuxuryCars.Pages.Admin
{
    [Authorize(Roles = "Admin")]
    public class MessagesModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public MessagesModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ContactMessage> Messages { get; set; } = new();

        public async Task OnGetAsync()
        {
            Messages = await _context.ContactMessages
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}
