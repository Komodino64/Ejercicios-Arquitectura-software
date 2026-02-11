using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ImperialLuxuryCars.Models;
using ImperialLuxuryCars.Data;

namespace ImperialLuxuryCars.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Car> Cars { get; set; } = new();

        [BindProperty(SupportsGet = true)]
        public string? SearchTerm { get; set; }

        [BindProperty(SupportsGet = true)]
        public string? Brand { get; set; }

        [BindProperty(SupportsGet = true)]
        public decimal? MaxPrice { get; set; }

        public async Task OnGetAsync()
        {
            var query = _context.Cars.AsQueryable();

            // Filtros
            if (!string.IsNullOrEmpty(SearchTerm))
            {
                query = query.Where(c => c.Brand.Contains(SearchTerm) || 
                                        c.Model.Contains(SearchTerm) || 
                                        c.Description.Contains(SearchTerm));
            }

            if (!string.IsNullOrEmpty(Brand))
            {
                query = query.Where(c => c.Brand == Brand);
            }

            if (MaxPrice.HasValue)
            {
                query = query.Where(c => c.Price <= MaxPrice.Value);
            }

            Cars = await query.OrderBy(c => c.Brand).ToListAsync();
        }
    }
}
