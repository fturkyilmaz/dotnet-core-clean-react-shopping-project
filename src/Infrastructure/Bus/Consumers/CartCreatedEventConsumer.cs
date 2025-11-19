using MassTransit;
using Microsoft.Extensions.Logging;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Infrastructure.Bus.Consumers;

public class CartCreatedEventConsumer : IConsumer<CartCreatedEvent>
{
    private readonly ILogger<CartCreatedEventConsumer> _logger;

    public CartCreatedEventConsumer(ILogger<CartCreatedEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<CartCreatedEvent> context)
    {
        _logger.LogInformation("CartCreatedEvent consumed: {CartId}", context.Message.Item.Id);
        return Task.CompletedTask;
    }
}
