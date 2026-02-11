using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ImperialLuxuryCars.Data;
using ImperialLuxuryCars.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Configurar SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=imperialluxury.db"));

// Configurar Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Configuración de password (más flexible para desarrollo)
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 4;
    
    // Configuración de usuario
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configurar cookies
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromHours(24);
});

var app = builder.Build();

// Inicializar base de datos y crear usuario admin por defecto
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    
    context.Database.EnsureCreated();
    
    // Crear roles
    if (!roleManager.RoleExistsAsync("Admin").Result)
    {
        roleManager.CreateAsync(new IdentityRole("Admin")).Wait();
    }
    if (!roleManager.RoleExistsAsync("User").Result)
    {
        roleManager.CreateAsync(new IdentityRole("User")).Wait();
    }
    
    // Crear usuario admin por defecto
    var adminEmail = "admin@imperialluxury.com";
    var adminUser = userManager.FindByEmailAsync(adminEmail).Result;
    if (adminUser == null)
    {
        adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FullName = "Administrador",
            EmailConfirmed = true
        };
        userManager.CreateAsync(adminUser, "admin123").Wait();
        userManager.AddToRoleAsync(adminUser, "Admin").Wait();
    }
    
    // Seed vehículos de lujo si no existen
    if (!context.Cars.Any())
    {
        context.Cars.AddRange(
            new Car
            {
                Brand = "Mercedes-Benz",
                Model = "S-Class",
                Year = 2024,
                Price = 120000m,
                Mileage = 0,
                Color = "Negro Obsidiana",
                FuelType = "Híbrido",
                Transmission = "Automática",
                ImageUrl = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
                Description = "El epítome del lujo alemán con tecnología de vanguardia",
                Status = "Disponible"
            },
            new Car
            {
                Brand = "BMW",
                Model = "7 Series",
                Year = 2024,
                Price = 105000m,
                Mileage = 0,
                Color = "Blanco Alpino",
                FuelType = "Híbrido",
                Transmission = "Automática",
                ImageUrl = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
                Description = "Lujo deportivo con el máximo rendimiento",
                Status = "Disponible"
            },
            new Car
            {
                Brand = "Audi",
                Model = "A8",
                Year = 2024,
                Price = 95000m,
                Mileage = 0,
                Color = "Gris Quantum",
                FuelType = "Gasolina",
                Transmission = "Automática",
                ImageUrl = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
                Description = "Tecnología Quattro y diseño refinado",
                Status = "Disponible"
            },
            new Car
            {
                Brand = "Porsche",
                Model = "Panamera",
                Year = 2024,
                Price = 140000m,
                Mileage = 0,
                Color = "Rojo Carmine",
                FuelType = "Híbrido",
                Transmission = "PDK",
                ImageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
                Description = "Rendimiento deportivo en un sedán de lujo",
                Status = "Disponible"
            },
            new Car
            {
                Brand = "Jaguar",
                Model = "XJ",
                Year = 2024,
                Price = 88000m,
                Mileage = 0,
                Color = "Azul eléctrico",
                FuelType = "Gasolina",
                Transmission = "Automática",
                ImageUrl = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
                Description = "Elegancia británica con performance excepcional",
                Status = "Disponible"
            },
            new Car
            {
                Brand = "Lexus",
                Model = "LS 500",
                Year = 2024,
                Price = 92000m,
                Mileage = 0,
                Color = "Plata Sonic",
                FuelType = "Híbrido",
                Transmission = "Automática",
                ImageUrl = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
                Description = "Confort japonés y tecnología innovadora",
                Status = "Disponible"
            }
        );
        context.SaveChanges();
    }
}


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

app.Run();
