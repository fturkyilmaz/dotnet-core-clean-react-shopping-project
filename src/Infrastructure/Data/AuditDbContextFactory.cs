using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ShoppingProject.Infrastructure.Data;

public class AuditDbContextFactory : IDesignTimeDbContextFactory<AuditDbContext>
{
    public AuditDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AuditDbContext>();

        // Migration için basit connection string kullan
        optionsBuilder.UseNpgsql(
            "Host=localhost;Database=AuditDb;Username=postgres;Password=postgres"
        );

        return new AuditDbContext(optionsBuilder.Options);
    }
}
