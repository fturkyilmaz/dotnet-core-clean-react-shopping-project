using ShoppingProject.Domain.Events;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Application.Products.EventHandlers;

public class ProductCompletedEventHandler : INotificationHandler<ProductCompletedEvent>
{
    private readonly ILogger<ProductCompletedEventHandler> _logger;

    public ProductCompletedEventHandler(ILogger<ProductCompletedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(ProductCompletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("ShoppingProject Domain Event: {DomainEvent}", notification.GetType().Name);

        return Task.CompletedTask;
    }
}
