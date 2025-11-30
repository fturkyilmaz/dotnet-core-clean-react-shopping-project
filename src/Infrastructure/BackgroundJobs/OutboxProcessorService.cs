using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.BackgroundJobs;

/// <summary>
/// Background service that processes outbox messages
/// Ensures reliable delivery of domain events to message bus
/// </summary>
public class OutboxProcessorService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OutboxProcessorService> _logger;
    private const int BatchSize = 20;
    private const int ProcessingIntervalSeconds = 10;

    public OutboxProcessorService(
        IServiceProvider serviceProvider,
        ILogger<OutboxProcessorService> logger
    )
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Outbox Processor Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessOutboxMessagesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing outbox messages");
            }

            await Task.Delay(TimeSpan.FromSeconds(ProcessingIntervalSeconds), stoppingToken);
        }

        _logger.LogInformation("Outbox Processor Service stopped");
    }

    private async Task ProcessOutboxMessagesAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var messageBus = scope.ServiceProvider.GetRequiredService<IServiceBus>();

        var unprocessedMessages = await context
            .OutboxMessages.Where(m => !m.IsProcessed && m.CanRetry)
            .OrderBy(m => m.OccurredOnUtc)
            .Take(BatchSize)
            .ToListAsync(cancellationToken);

        if (!unprocessedMessages.Any())
            return;

        _logger.LogInformation("Processing {Count} outbox messages", unprocessedMessages.Count);

        foreach (var message in unprocessedMessages)
        {
            try
            {
                // Deserialize and publish the event
                var eventType = Type.GetType(message.Type);
                if (eventType == null)
                {
                    _logger.LogWarning(
                        "Event type {Type} not found for message {Id}",
                        message.Type,
                        message.Id
                    );
                    message.MarkAsFailed($"Event type {message.Type} not found");
                    continue;
                }

                var @event = JsonSerializer.Deserialize(message.Content, eventType);
                if (@event == null)
                {
                    _logger.LogWarning("Failed to deserialize message {Id}", message.Id);
                    message.MarkAsFailed("Failed to deserialize message");
                    continue;
                }

                // Publish to message bus
                await messageBus.PublishAsync(@event, cancellationToken);

                message.MarkAsProcessed();
                _logger.LogInformation("Successfully processed outbox message {Id}", message.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing outbox message {Id}", message.Id);
                message.MarkAsFailed(ex.Message);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
