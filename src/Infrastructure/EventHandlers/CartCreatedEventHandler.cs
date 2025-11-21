using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Events;
using Microsoft.Extensions.Logging;
using MediatR;

namespace ShoppingProject.Infrastructure.EventHandlers;

public class CartCreatedEventHandler : INotificationHandler<DomainEventNotification<CartCreatedEvent>>
{
    private readonly ILogger<CartCreatedEventHandler> _logger;

    public CartCreatedEventHandler(ILogger<CartCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(DomainEventNotification<CartCreatedEvent> notification, CancellationToken cancellationToken)
    {
        var domainEvent = notification.DomainEvent;

        _logger.LogInformation("ShoppingProject Domain Event: {DomainEvent}", domainEvent.GetType().Name);

        return Task.CompletedTask;
    }
}
