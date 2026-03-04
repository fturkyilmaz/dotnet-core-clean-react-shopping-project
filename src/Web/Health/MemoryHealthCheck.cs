using System.Collections;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ShoppingProject.Web.Health;

/// <summary>
/// Health check for application memory usage.
/// </summary>
public class MemoryHealthCheck : IHealthCheck
{
    private readonly ILogger<MemoryHealthCheck> _logger;
    private readonly long _maxMemoryBytes;

    public MemoryHealthCheck(ILogger<MemoryHealthCheck> logger, long maxMemoryBytes = 1024L * 1024 * 1024) // Default 1GB
    {
        _logger = logger;
        _maxMemoryBytes = maxMemoryBytes;
    }

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var totalMemory = GC.GetTotalMemory(false);
        var data = new Dictionary<string, object>
        {
            { "AllocatedBytes", totalMemory },
            { "AllocatedMB", totalMemory / 1024 / 1024 },
            { "MaxAllowedMB", _maxMemoryBytes / 1024 / 1024 },
            { "Gen0Collections", GC.CollectionCount(0) },
            { "Gen1Collections", GC.CollectionCount(1) },
            { "Gen2Collections", GC.CollectionCount(2) }
        };

        if (totalMemory > _maxMemoryBytes)
        {
            _logger.LogWarning("Memory usage exceeded threshold: {MemoryMB}MB", totalMemory / 1024 / 1024);
            return Task.FromResult(HealthCheckResult.Degraded(
                $"Memory usage is high: {totalMemory / 1024 / 1024}MB",
                data: data));
        }

        return Task.FromResult(HealthCheckResult.Healthy(
            $"Memory usage is normal: {totalMemory / 1024 / 1024}MB",
            data: data));
    }
}
