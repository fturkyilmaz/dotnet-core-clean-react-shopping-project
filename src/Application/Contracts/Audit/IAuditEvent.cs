namespace ShoppingProject.Application.Contracts.Audit;

public interface IAuditEvent
{
    string? UserId { get; init; }
    string? UserEmail { get; init; }
    string Action { get; init; }
    string EntityName { get; init; }
    string EntityId { get; init; }
    string? OldValues { get; init; }
    string? NewValues { get; init; }
    DateTimeOffset Timestamp { get; init; }
    string? CorrelationId { get; init; }
    string? RemoteIp { get; init; }
    string? UserAgent { get; init; }
}
