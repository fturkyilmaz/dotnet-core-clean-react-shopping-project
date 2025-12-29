namespace Application.Common.Events;
public sealed record AuditEvent(
    Guid Id,
    string EntityName,
    string Action,
    string EntityId,
    string OldValues,
    string NewValues,
    string UserId,
    string UserEmail,
    DateTime CreatedAt
);
