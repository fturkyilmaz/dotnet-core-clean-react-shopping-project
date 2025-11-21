using ShoppingProject.Domain.Events;
using MassTransit;

namespace ShoppingProject.Infrastructure.Bus.Consumers
{
    public class ProductAddedEventConsumer : IConsumer<ProductAddedEvent>
    {
        public Task Consume(ConsumeContext<ProductAddedEvent> context)
        {
            Console.WriteLine($"Received Event: {context.Message.Item.Id} - {context.Message.Item.Title} - {context.Message.Item.Price}");
            return Task.CompletedTask;
        }
    }
}