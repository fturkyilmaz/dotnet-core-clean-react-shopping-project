using MassTransit;
using Microsoft.Extensions.Logging;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Infrastructure.Bus.Consumers;

/// <summary>
/// Consumer for CartCreatedEvent - handles post-cart creation operations.
/// </summary>
public class CartCreatedEventConsumer : IConsumer<CartCreatedEvent>
{
    private readonly ILogger<CartCreatedEventConsumer> _logger;

    public CartCreatedEventConsumer(ILogger<CartCreatedEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<CartCreatedEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Cart created event consumed - CartId: {CartId}, Title: {Title}, OwnerId: {OwnerId}, Quantity: {Quantity}",
            message.CartId,
            message.Title,
            message.OwnerId,
            message.Quantity);

        // Post-creation logic can be implemented here:
        // - Send notification to user
        // - Update analytics
        // - Trigger inventory checks

        return Task.CompletedTask;
    }
}
