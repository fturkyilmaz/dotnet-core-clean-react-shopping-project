using ShoppingProject.Domain.Common;

namespace ShoppingProject.Application.Contracts.ServiceBus;

public interface IServiceBus
{
    Task PublishAsync<T>(T @event, CancellationToken cancellation = default, string? messageId = null) where T : class;
    Task SendAsync<T>(T message, string queueName, CancellationToken cancellation = default) where T : class;
}
