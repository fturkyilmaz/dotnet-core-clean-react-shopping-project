namespace ShoppingProject.Infrastructure.Configuration;

/// <summary>
/// Service Bus (RabbitMQ) configuration options.
/// </summary>
public class ServiceBusOptions
{
    /// <summary>
    /// Configuration section name in appsettings.json
    /// </summary>
    public const string SectionName = "ServiceBusOption";

    /// <summary>
    /// RabbitMQ connection URI (e.g., amqp://guest:guest@localhost:5672/)
    /// </summary>
    public string? Url { get; set; }
}
