using ShoppingProject.Application.Contracts.ServiceBus;
using ShoppingProject.Infrastructure.Bus.Consumers;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Domain.Options;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ShoppingProject.Infrastructure.Bus
{
    public static class BusExtensions
    {
        public static void AddBusExt(this IServiceCollection services, IConfiguration configuration)
        {
            var serviceBusOption = configuration.GetSection(nameof(ServiceBusOption)).Get<ServiceBusOption>();
            services.AddScoped<IServiceBus, ServiceBus>();
            services.AddMassTransit(x =>
            {
                x.AddConsumer<ProductAddedEventConsumer>();
                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(new Uri(serviceBusOption!.Url), h => { });
                    cfg.ReceiveEndpoint(ServiceBusConst.ProductAddedEventQueueName,
                        e => { e.ConfigureConsumer<ProductAddedEventConsumer>(context); });
                });
            });
        }
    }
}
