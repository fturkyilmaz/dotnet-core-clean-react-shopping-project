using Consul;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http.Features;

namespace ShoppingProject.WebApi.Extensions;

public static class ConsulRegistrationExtensions
{
    public static IServiceCollection AddConsulConfig(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddSingleton<IConsulClient, ConsulClient>(p => new ConsulClient(consulConfig =>
        {
            var address = configuration.GetValue<string>("Consul:Host") ?? "http://localhost:8500";
            consulConfig.Address = new Uri(address);
        }));

        return services;
    }

    public static IApplicationBuilder UseConsul(
        this IApplicationBuilder app,
        IConfiguration configuration
    )
    {
        var consulClient = app.ApplicationServices.GetRequiredService<IConsulClient>();
        var logger = app
            .ApplicationServices.GetRequiredService<ILoggerFactory>()
            .CreateLogger("AppExtensions");
        var lifetime = app.ApplicationServices.GetRequiredService<IHostApplicationLifetime>();

        // Get server IP address
        var features = app.Properties["server.Features"] as FeatureCollection;
        var addresses = features?.Get<IServerAddressesFeature>();
        var address = addresses?.Addresses.FirstOrDefault();

        if (string.IsNullOrEmpty(address))
        {
            logger.LogWarning("Consul registration failed: No server address found.");
            return app;
        }

        var uri = new Uri(address);
        var registration = new AgentServiceRegistration()
        {
            ID = $"ShoppingProject-{uri.Port}",
            Name = "ShoppingProject",
            Address = $"{uri.Host}",
            Port = uri.Port,
            Tags = new[] { "api" },
        };

        logger.LogInformation("Registering with Consul");
        consulClient.Agent.ServiceDeregister(registration.ID).Wait();
        consulClient.Agent.ServiceRegister(registration).Wait();

        lifetime.ApplicationStopping.Register(() =>
        {
            logger.LogInformation("Deregistering from Consul");
            consulClient.Agent.ServiceDeregister(registration.ID).Wait();
        });

        return app;
    }
}
