using ShoppingProject.Application.Contracts.ServiceBus;
using MassTransit;

namespace ShoppingProject.Infrastructure.Bus
{
    public class ServiceBus : IServiceBus
    {
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly ISendEndpointProvider _sendEndpointProvider;

        public ServiceBus(IPublishEndpoint publishEndpoint, ISendEndpointProvider sendEndpointProvider)
        {
            _publishEndpoint = publishEndpoint;
            _sendEndpointProvider = sendEndpointProvider;
        }

        public async Task PublishAsync<T>(
            T @event,
            CancellationToken cancellation = default,
            string? messageId = null
        ) where T : class
        {
            await _publishEndpoint.Publish(@event, context =>
            {
                if (!string.IsNullOrEmpty(messageId) && Guid.TryParse(messageId, out var guid))
                {
                    context.MessageId = guid;
                }
            }, cancellation);
        }

        public async Task SendAsync<T>(
            T message,
            string queueName,
            CancellationToken cancellation = default
        ) where T : class
        {
            var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri($"queue:{queueName}"));
            await endpoint.Send(message, cancellation);
        }
    }
}
