using ShoppingProject.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure; // for GetService
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Infrastructure.Data.Interceptors;

/// <summary>
/// Interceptor that dispatches domain events after changes are saved to the database.
/// Supports both immediate publishing and outbox pattern.
/// </summary>
public class DispatchDomainEventsInterceptor : SaveChangesInterceptor
{
    private readonly IMediator _mediator;
    private readonly ILogger<DispatchDomainEventsInterceptor> _logger;

    public DispatchDomainEventsInterceptor(
        IMediator mediator,
        ILogger<DispatchDomainEventsInterceptor> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        DispatchDomainEvents(eventData.Context, CancellationToken.None).GetAwaiter().GetResult();
        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        await DispatchDomainEvents(eventData.Context, cancellationToken);
        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private async Task DispatchDomainEvents(DbContext? context, CancellationToken cancellationToken = default)
    {
        if (context == null) return;

        var entities = context.ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        if (!entities.Any()) return;

        var domainEvents = entities.SelectMany(e => e.DomainEvents).ToList();
        entities.ForEach(e => e.ClearDomainEvents());

        _logger.LogInformation("Dispatching {Count} domain events from {EntityCount} entities",
            domainEvents.Count, entities.Count);

        var outboxStore = context.GetService<IOutboxMessageStore>();
        var clock = context.GetService<IClock>();

        foreach (var domainEvent in domainEvents)
        {
            try
            {
                if (outboxStore != null && clock != null)
                {
                    await outboxStore.AddEventAsync(domainEvent, correlationId: null, cancellationToken);
                    _logger.LogDebug("Added domain event {EventType} to outbox", domainEvent.GetType().Name);
                }

                var notification = GetNotificationCorrespondingToDomainEvent(domainEvent);
                await _mediator.Publish(notification, cancellationToken);

                _logger.LogDebug("Dispatched domain event {EventType}", domainEvent.GetType().Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error dispatching domain event {EventType}", domainEvent.GetType().Name);
                throw new InvalidOperationException(
                    $"Error dispatching domain event {domainEvent.GetType().Name}", ex);
            }
        }
    }

    private static INotification GetNotificationCorrespondingToDomainEvent(BaseEvent domainEvent)
    {
        return (INotification)Activator.CreateInstance(
            typeof(DomainEventNotification<>).MakeGenericType(domainEvent.GetType()),
            domainEvent)!;
    }
}
