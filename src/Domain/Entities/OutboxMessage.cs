using System.ComponentModel.DataAnnotations.Schema;
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
    public string? CorrelationId { get; set; }
    public DateTime OccurredOnUtc { get; set; }
    public DateTime? ProcessedOnUtc { get; set; }
    public string? Error { get; set; }
    public int RetryCount { get; set; }
    public DateTime? NextRetryUtc { get; set; }

    [NotMapped]
    public bool IsProcessed => ProcessedOnUtc.HasValue;

    [NotMapped]
    public bool HasFailed => !string.IsNullOrEmpty(Error);

    // Methodlarda NotMapped gerekmez
    public bool CanRetry(DateTimeOffset utcNow)
    {
        return RetryCount < 5 && (!NextRetryUtc.HasValue || NextRetryUtc.Value <= utcNow.DateTime);
    }
    
    public void MarkAsProcessed(DateTimeOffset utcNow)
    {
        ProcessedOnUtc = utcNow.DateTime;
        Error = null;
    }

    public void MarkAsFailed(string error, DateTimeOffset utcNow)
    {
        Error = error;
        RetryCount++;

        var delayMinutes = Math.Pow(2, RetryCount);
        NextRetryUtc = utcNow.DateTime.AddMinutes(delayMinutes);
    }

    public void MarkAsDeadLetter(string error, DateTimeOffset utcNow)
    {
        Error = error;
        ProcessedOnUtc = utcNow.DateTime; // Mark as processed to prevent further retries
        RetryCount = 5; // Indicate it has reached max retries
    }
}
