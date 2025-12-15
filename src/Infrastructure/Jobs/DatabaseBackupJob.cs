using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Common.Exceptions;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Jobs;

public class DatabaseBackupJob
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseBackupJob> _logger;
    private readonly IClock _clock;

    public DatabaseBackupJob(
        ApplicationDbContext context,
        ILogger<DatabaseBackupJob> logger,
        IClock clock
    )
    {
        _context = context;
        _logger = logger;
        _clock = clock;
    }

    public async Task RunAsync()
    {
        var correlationId = Guid.NewGuid().ToString();

        using (
            _logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["CorrelationId"] = correlationId,
                    ["JobName"] = "DatabaseBackup",
                }
            )
        )
        {
            _logger.LogInformation(
                "Starting database backup job with CorrelationId: {CorrelationId}",
                correlationId
            );

            try
            {
                var backupDirectory = Path.Combine(Directory.GetCurrentDirectory(), "backups");
                if (!Directory.Exists(backupDirectory))
                {
                    Directory.CreateDirectory(backupDirectory);
                }

                var timestamp = _clock.UtcNow.ToString("yyyyMMddHHmmss");

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
                    "Database backup completed successfully. Files saved to {BackupDirectory}",
                    backupDirectory
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during database backup");
                throw new InfrastructureException("Error occurred during database backup", ex);
            }
        }
    }
}
