using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ShoppingProject.Infrastructure.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Migration için basit connection string kullan
            optionsBuilder.UseNpgsql(
                "Host=localhost;Database=ShoppingProjectDb;Username=postgres;Password=postgres"
            );

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
