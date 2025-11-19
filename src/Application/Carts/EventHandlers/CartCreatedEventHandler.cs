using ShoppingProject.Domain.Events;
using Microsoft.Extensions.Logging;
using MediatR;

namespace ShoppingProject.Application.Carts.EventHandlers;

public class CartCreatedEventHandler : INotificationHandler<CartCreatedEvent>
{
    private readonly ILogger<CartCreatedEventHandler> _logger;

    public CartCreatedEventHandler(ILogger<CartCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(CartCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("ShoppingProject Domain Event: {DomainEvent}", notification.GetType().Name);

        return Task.CompletedTask;
    }
}
