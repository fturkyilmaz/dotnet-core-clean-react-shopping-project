using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.BackgroundJobs;

public class AuditCleanupWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AuditCleanupWorker> _logger;
    private readonly int _retentionDays = 90; // Should be in config

    public AuditCleanupWorker(IServiceProvider serviceProvider, ILogger<AuditCleanupWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation(
                "Starting audit log cleanup. Retention days: {RetentionDays}",
                _retentionDays
            );

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AuditDbContext>();

                var cutoffDate = DateTimeOffset.UtcNow.AddDays(-_retentionDays);

                var deletedCount = await dbContext
                    .AuditLogs.Where(x => x.Timestamp < cutoffDate)
                    .ExecuteDeleteAsync(stoppingToken);

                _logger.LogInformation(
                    "Completed audit log cleanup. Deleted {DeletedCount} records.",
                    deletedCount
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during audit log cleanup.");
            }

            // Run once per day
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
