using ShoppingProject.Domain.Events;
using MassTransit;

namespace ShoppingProject.Infrastructure.Bus.Consumers
{
    public class ProductAddedEventConsumer : IConsumer<ProductAddedEvent>
    {
        public Task Consume(ConsumeContext<ProductAddedEvent> context)
        {
            Console.WriteLine($"Received Event: {context.Message.Id} - {context.Message.Name} - {context.Message.Price}");
            return Task.CompletedTask;
        }
    }
}