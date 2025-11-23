using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Jobs;

public class DatabaseBackupJob
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseBackupJob> _logger;

    public DatabaseBackupJob(ApplicationDbContext context, ILogger<DatabaseBackupJob> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task RunAsync()
    {
        _logger.LogInformation("Starting database backup job...");

        try
        {
            var backupDirectory = Path.Combine(Directory.GetCurrentDirectory(), "backups");
            if (!Directory.Exists(backupDirectory))
            {
                Directory.CreateDirectory(backupDirectory);
            }

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            // Backup Products
            var products = await _context.Products.AsNoTracking().ToListAsync();
            var productsJson = JsonConvert.SerializeObject(products, Formatting.Indented);
            await File.WriteAllTextAsync(
                Path.Combine(backupDirectory, $"products_{timestamp}.json"),
                productsJson
            );

            // Backup Carts
            var carts = await _context.Carts.AsNoTracking().ToListAsync();
            var cartsJson = JsonConvert.SerializeObject(carts, Formatting.Indented);
            await File.WriteAllTextAsync(
                Path.Combine(backupDirectory, $"carts_{timestamp}.json"),
                cartsJson
            );

            _logger.LogInformation(
                $"Database backup completed successfully. Files saved to {backupDirectory}"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during database backup.");
            throw;
        }
    }
}
