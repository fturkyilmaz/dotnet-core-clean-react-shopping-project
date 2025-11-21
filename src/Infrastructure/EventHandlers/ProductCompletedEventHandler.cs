using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Events;
using Microsoft.Extensions.Logging;
using MediatR;

namespace ShoppingProject.Infrastructure.EventHandlers;

public class ProductCompletedEventHandler : INotificationHandler<DomainEventNotification<ProductCompletedEvent>>
{
    private readonly ILogger<ProductCompletedEventHandler> _logger;

    public ProductCompletedEventHandler(ILogger<ProductCompletedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(DomainEventNotification<ProductCompletedEvent> notification, CancellationToken cancellationToken)
    {
        var domainEvent = notification.DomainEvent;

        _logger.LogInformation("ShoppingProject Domain Event: {DomainEvent}", domainEvent.GetType().Name);

        return Task.CompletedTask;
    }
}
