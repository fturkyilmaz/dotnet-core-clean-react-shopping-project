namespace ShoppingProject.Infrastructure.Configuration;

/// <summary>
/// Hangfire job processing configuration options.
/// </summary>
public class HangfireOptions
{
    /// <summary>
    /// Configuration section name in appsettings.json
    /// </summary>
    public const string SectionName = "Hangfire";

    /// <summary>
    /// Connection string for Hangfire storage
    /// </summary>
    public string? ConnectionString { get; set; }

    /// <summary>
    /// Number of worker threads for processing background jobs
    /// </summary>
    public int WorkerCount { get; set; } = 5;

    /// <summary>
    /// Dashboard path (e.g., /hangfire)
    /// </summary>
    public string DashboardPath { get; set; } = "/hangfire";
}
