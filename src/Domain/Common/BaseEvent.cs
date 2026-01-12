namespace ShoppingProject.Domain.Common;

/// <summary>
/// Base class for all domain events.
/// </summary>
public abstract class BaseEvent
{
    /// <summary>
    /// When the event occurred (UTC).
    /// </summary>
    public DateTimeOffset OccurredOnUtc { get; init; } = DateTimeOffset.UtcNow;
}
