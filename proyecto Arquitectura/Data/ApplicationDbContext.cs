using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using ImperialLuxuryCars.Models;

namespace ImperialLuxuryCars.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Car> Cars { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Datos iniciales
            modelBuilder.Entity<Car>().HasData(
                new Car
                {
                    Id = 1,
                    Brand = "Mercedes-Benz",
                    Model = "S-Class",
                    Year = 2024,
                    Price = 120000,
                    ImageUrl = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500",
                    Description = "Lujo y elegancia en su máxima expresión",
                    Status = "Disponible",
                    Mileage = 0,
                    Color = "Negro",
                    FuelType = "Gasolina",
                    Transmission = "Automática"
                },
                new Car
                {
                    Id = 2,
                    Brand = "BMW",
                    Model = "7 Series",
                    Year = 2024,
                    Price = 105000,
                    ImageUrl = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500",
                    Description = "Tecnología y confort premium",
                    Status = "Disponible",
                    Mileage = 0,
                    Color = "Azul",
                    FuelType = "Híbrido",
                    Transmission = "Automática"
                },
                new Car
                {
                    Id = 3,
                    Brand = "Audi",
                    Model = "A8",
                    Year = 2023,
                    Price = 95000,
                    ImageUrl = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
                    Description = "Diseño sofisticado y potencia",
                    Status = "Disponible",
                    Mileage = 5000,
                    Color = "Gris",
                    FuelType = "Gasolina",
                    Transmission = "Automática"
                },
                new Car
                {
                    Id = 4,
                    Brand = "Porsche",
                    Model = "Panamera",
                    Year = 2024,
                    Price = 140000,
                    ImageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500",
                    Description = "Deportividad y exclusividad",
                    Status = "Disponible",
                    Mileage = 0,
                    Color = "Rojo",
                    FuelType = "Gasolina",
                    Transmission = "Automática"
                },
                new Car
                {
                    Id = 5,
                    Brand = "Jaguar",
                    Model = "XJ",
                    Year = 2023,
                    Price = 88000,
                    ImageUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
                    Description = "Elegancia británica",
                    Status = "Disponible",
                    Mileage = 8000,
                    Color = "Blanco",
                    FuelType = "Gasolina",
                    Transmission = "Automática"
                },
                new Car
                {
                    Id = 6,
                    Brand = "Lexus",
                    Model = "LS 500",
                    Year = 2024,
                    Price = 92000,
                    ImageUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500",
                    Description = "Refinamiento japonés",
                    Status = "Disponible",
                    Mileage = 2000,
                    Color = "Plata",
                    FuelType = "Híbrido",
                    Transmission = "Automática"
                }
            );
        }
    }
}
