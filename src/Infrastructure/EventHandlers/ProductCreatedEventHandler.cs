using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Events;
using Microsoft.Extensions.Logging;
using MediatR;

namespace ShoppingProject.Infrastructure.EventHandlers;

public class ProductCreatedEventHandler : INotificationHandler<DomainEventNotification<ProductCreatedEvent>>
{
    private readonly ILogger<ProductCreatedEventHandler> _logger;

    public ProductCreatedEventHandler(ILogger<ProductCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(DomainEventNotification<ProductCreatedEvent> notification, CancellationToken cancellationToken)
    {
        var domainEvent = notification.DomainEvent;

        _logger.LogInformation("ShoppingProject Domain Event: {DomainEvent}", domainEvent.GetType().Name);

        return Task.CompletedTask;
    }
}
    