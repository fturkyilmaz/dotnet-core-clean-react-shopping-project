using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Entities;

/// <summary>
/// Outbox pattern entity for reliable message delivery
/// Ensures that domain events are persisted and published reliably
/// </summary>
public class OutboxMessage : BaseEntity
{
    public string Type { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime OccurredOnUtc { get; set; }
    public DateTime? ProcessedOnUtc { get; set; }
    public string? Error { get; set; }
    public int RetryCount { get; set; }
    public DateTime? NextRetryUtc { get; set; }

    public bool IsProcessed => ProcessedOnUtc.HasValue;
    public bool HasFailed => !string.IsNullOrEmpty(Error);
    public bool CanRetry =>
        RetryCount < 5 && (!NextRetryUtc.HasValue || NextRetryUtc.Value <= DateTime.UtcNow);

    public void MarkAsProcessed()
    {
        ProcessedOnUtc = DateTime.UtcNow;
        Error = null;
    }

    public void MarkAsFailed(string error)
    {
        Error = error;
        RetryCount++;

        // Exponential backoff: 1min, 2min, 4min, 8min, 16min
        var delayMinutes = Math.Pow(2, RetryCount);
        NextRetryUtc = DateTime.UtcNow.AddMinutes(delayMinutes);
    }
}
