using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShoppingProject.Application.Contracts.ServiceBus;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Domain.Options;
using ShoppingProject.Infrastructure.Bus.Consumers;
using ShoppingProject.Infrastructure.Bus.Consumers.Audit;

namespace ShoppingProject.Infrastructure.Bus
{
    public static class BusExtensions
    {
        public static void AddBusExt(this IServiceCollection services, IConfiguration configuration)
        {
            var serviceBusOption = configuration
                .GetSection(nameof(ServiceBusOption))
                .Get<ServiceBusOption>();
            services.AddScoped<IServiceBus, ServiceBus>();
            services.AddMassTransit(x =>
            {
                x.AddConsumer<ProductAddedEventConsumer>();
                x.AddConsumer<CartCreatedEventConsumer>();
                x.AddConsumer<AuditEventConsumer>();

                x.UsingRabbitMq(
                    (context, cfg) =>
                    {
                        cfg.Host(new Uri(serviceBusOption!.Url), h => { });

                        cfg.ReceiveEndpoint(
                            ServiceBusConst.ProductAddedEventQueueName,
                            e =>
                            {
                                e.UseMessageRetry(r => r.Interval(5, TimeSpan.FromSeconds(5)));
                                e.ConfigureConsumer<ProductAddedEventConsumer>(context);
                            }
                        );

                        cfg.ReceiveEndpoint(
                            ServiceBusConst.CartCreatedEventQueueName,
                            e =>
                            {
                                e.UseMessageRetry(r => r.Interval(5, TimeSpan.FromSeconds(5)));
                                e.ConfigureConsumer<CartCreatedEventConsumer>(context);
                            }
                        );

                        cfg.ReceiveEndpoint(
                            "audit-log-queue",
                            e =>
                            {
                                e.UseMessageRetry(r => r.Interval(5, TimeSpan.FromSeconds(5)));
                                e.ConfigureConsumer<AuditEventConsumer>(context);
                            }
                        );
                    }
                );
            });
        }
    }
}
