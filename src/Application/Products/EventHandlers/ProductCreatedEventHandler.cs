using ShoppingProject.Domain.Events;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Application.Products.EventHandlers;

public class ProductCreatedEventHandler : INotificationHandler<ProductCreatedEvent>
{
    private readonly ILogger<ProductCreatedEventHandler> _logger;

    public ProductCreatedEventHandler(ILogger<ProductCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(ProductCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("ShoppingProject Domain Event: {DomainEvent}", notification.GetType().Name);

        return Task.CompletedTask;
    }
}
    