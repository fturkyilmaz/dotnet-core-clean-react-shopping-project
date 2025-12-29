using ShoppingProject.Application.Contracts.Audit;

namespace ShoppingProject.Infrastructure.Bus.Events;

public record AuditEvent : IAuditEvent
{
    public string? UserId { get; init; }
    public string? UserEmail { get; init; }
    public required string Action { get; init; }
    public required string EntityName { get; init; }
    public required string EntityId { get; init; }
    public string? OldValues { get; init; }
    public string? NewValues { get; init; }
    public DateTimeOffset Timestamp { get; init; }
    public string? CorrelationId { get; init; }
    public string? RemoteIp { get; init; }
    public string? UserAgent { get; init; }
}
