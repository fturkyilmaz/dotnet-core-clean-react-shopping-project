namespace ShoppingProject.Domain.Entities;

public class AuditLog : BaseEntity
{
    public string? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? Action { get; set; } // Added | Modified | Deleted | Custom
    public string? EntityName { get; set; }
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTimeOffset Timestamp { get; set; }

    // Request Context metadata
    public string? CorrelationId { get; set; }
    public string? RemoteIp { get; set; }
    public string? UserAgent { get; set; }

    // Tamper-proof chaining
    public string? PreviousHash { get; set; }
    public string? Hash { get; set; }
}
