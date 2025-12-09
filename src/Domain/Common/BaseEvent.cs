namespace ShoppingProject.Domain.Common;

public abstract class BaseEvent
{
    public DateTimeOffset DateOccurred { get; protected set; } = DateTimeOffset.UtcNow;
}
