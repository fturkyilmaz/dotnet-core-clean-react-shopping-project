using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Services;

/// <summary>
/// Implementation of IOutboxMessageStore using Entity Framework Core.
/// Manages the reliable publication of domain events through the outbox pattern.
/// </summary>
public class OutboxMessageStore : IOutboxMessageStore
{
    private readonly ApplicationDbContext _context;
    private readonly IClock _clock;
    private readonly ILogger<OutboxMessageStore> _logger;

    public OutboxMessageStore(
        ApplicationDbContext context,
        IClock clock,
        ILogger<OutboxMessageStore> logger)
    {
        _context = context;
        _clock = clock;
        _logger = logger;
    }

    public async Task<OutboxMessage> AddEventAsync(
        BaseEvent domainEvent,
        string? correlationId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var outboxMessage = new OutboxMessage
            {
                Type = domainEvent.GetType().FullName ?? string.Empty,
                Content = JsonSerializer.Serialize(
                    domainEvent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ),
                CorrelationId = correlationId,
                OccurredOnUtc = domainEvent.OccurredOnUtc.UtcDateTime,
                RetryCount = 0,
            };

            await _context.OutboxMessages.AddAsync(outboxMessage, cancellationToken).ConfigureAwait(false);
            // Persisting here keeps the outbox write transactional if called within a unit of work
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            _logger.LogInformation("Outbox message {MessageId} added for event {EventType}", outboxMessage.Id, outboxMessage.Type);
            return outboxMessage;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding domain event to outbox: {EventType}", domainEvent.GetType().Name);
            throw new InvalidOperationException(
                $"Failed to add outbox message for domain event '{domainEvent.GetType().Name}'.",
                ex);
        }
    }

    public async Task<IReadOnlyList<OutboxMessage>> GetUnprocessedMessagesAsync(
        int batchSize = 20,
        CancellationToken cancellationToken = default)
    {
        var utcNow = _clock.UtcNow;

        return await _context.OutboxMessages
            .Where(m => m.ProcessedOnUtc == null)
            .Where(m => !m.NextRetryUtc.HasValue || m.NextRetryUtc <= utcNow.DateTime)
            .OrderBy(m => m.OccurredOnUtc)
            .Take(batchSize)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task MarkAsProcessedAsync(
        int messageId,
        DateTimeOffset processedAtUtc,
        CancellationToken cancellationToken = default)
    {
        var message = await _context.OutboxMessages.FindAsync(
            new object[] { messageId },
            cancellationToken: cancellationToken).ConfigureAwait(false);

        if (message == null)
        {
            _logger.LogWarning("Outbox message {MessageId} not found", messageId);
            return;
        }

        message.MarkAsProcessed(processedAtUtc);
        _context.OutboxMessages.Update(message);

        try
        {
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            _logger.LogInformation("Marked outbox message {MessageId} as processed", messageId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking outbox message {MessageId} as processed", messageId);
            throw new InvalidOperationException(
                $"Failed to mark outbox message '{messageId}' as processed.",
                ex);
        }
    }

    public async Task MarkAsFailedAsync(
        int messageId,
        string error,
        DateTimeOffset failedAtUtc,
        CancellationToken cancellationToken = default)
    {
        var message = await _context.OutboxMessages.FindAsync(
            new object[] { messageId },
            cancellationToken: cancellationToken).ConfigureAwait(false);

        if (message == null)
        {
            _logger.LogWarning("Outbox message {MessageId} not found", messageId);
            return;
        }

        message.MarkAsFailed(error, failedAtUtc);
        _context.OutboxMessages.Update(message);

        try
        {
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            _logger.LogWarning(
                "Marked outbox message {MessageId} as failed. Retry count: {RetryCount}. Error: {Error}",
                messageId,
                message.RetryCount,
                error);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking outbox message {MessageId} as failed", messageId);
            throw new InvalidOperationException(
                $"Failed to mark outbox message '{messageId}' as failed.",
                ex);
        }
    }

    public async Task MarkAsDeadLetterAsync(
        int messageId,
        string error,
        DateTimeOffset failedAtUtc,
        CancellationToken cancellationToken = default)
    {
        var message = await _context.OutboxMessages.FindAsync(
            new object[] { messageId },
            cancellationToken: cancellationToken).ConfigureAwait(false);

        if (message == null)
        {
            _logger.LogWarning("Outbox message {MessageId} not found", messageId);
            return;
        }

        message.MarkAsDeadLetter(error, failedAtUtc);
        _context.OutboxMessages.Update(message);

        try
        {
            await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            _logger.LogError(
                "Marked outbox message {MessageId} as dead-letter after {RetryCount} retries. Error: {Error}",
                messageId,
                message.RetryCount,
                error);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking outbox message {MessageId} as dead-letter", messageId);
            throw new InvalidOperationException(
                $"Failed to mark outbox message '{messageId}' as dead-letter.",
                ex);
        }
    }

    public async Task<OutboxMessage?> GetByIdAsync(
        int messageId,
        CancellationToken cancellationToken = default)
    {
        return await _context.OutboxMessages
            .FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<int> CleanupProcessedMessagesAsync(
        TimeSpan olderThan,
        CancellationToken cancellationToken = default)
    {
        var cutoffDate = _clock.UtcNow.DateTime.Subtract(olderThan);

        try
        {
            var deletedCount = await _context.OutboxMessages
                .Where(m => m.ProcessedOnUtc.HasValue && m.ProcessedOnUtc <= cutoffDate)
                .ExecuteDeleteAsync(cancellationToken)
                .ConfigureAwait(false);

            _logger.LogInformation(
                "Cleaned up {Count} processed outbox messages older than {CutoffDate}",
                deletedCount,
                cutoffDate);

            return deletedCount;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning up processed outbox messages older than {CutoffDate}", cutoffDate);
            throw new InvalidOperationException(
                $"Failed to clean up processed outbox messages older than '{cutoffDate:o}'.",
                ex);
        }
    }
}
