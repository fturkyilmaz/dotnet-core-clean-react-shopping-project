using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

/// <summary>
/// Interface for managing outbox messages.
/// Provides operations to store, retrieve, and update outbox messages.
/// </summary>
public interface IOutboxMessageStore
{
   /// <summary>
/// Adds a domain event to the outbox for reliable publication.
/// Should be called within the same transaction as the entity changes.
/// </summary>
/// <param name="domainEvent">The domain event to store.</param>
/// <param name="correlationId">Optional correlation ID for tracing.</param>
/// <param name="cancellationToken">Token to cancel the operation.</param>
/// <returns>The created OutboxMessage.</returns>
Task<OutboxMessage> AddEventAsync(
    BaseEvent domainEvent,
    string? correlationId = null,
    CancellationToken cancellationToken = default);


    /// <summary>
    /// Retrieves unprocessed outbox messages that are ready for processing.
    /// </summary>
    /// <param name="batchSize">Maximum number of messages to retrieve.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of unprocessed outbox messages.</returns>
    Task<IReadOnlyList<OutboxMessage>> GetUnprocessedMessagesAsync(
        int batchSize = 20,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks an outbox message as successfully processed.
    /// </summary>
    Task MarkAsProcessedAsync(
        int messageId,
        DateTimeOffset processedAtUtc,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks an outbox message as failed and schedules retry.
    /// </summary>
    Task MarkAsFailedAsync(
        int messageId,
        string error,
        DateTimeOffset failedAtUtc,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks an outbox message as dead-lettered (permanently failed).
    /// </summary>
    Task MarkAsDeadLetterAsync(
        int messageId,
        string error,
        DateTimeOffset failedAtUtc,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves an outbox message by ID.
    /// </summary>
    Task<OutboxMessage?> GetByIdAsync(
        int messageId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Cleans up old processed messages (older than the specified age).
    /// </summary>
    Task<int> CleanupProcessedMessagesAsync(
        TimeSpan olderThan,
        CancellationToken cancellationToken = default);
}
