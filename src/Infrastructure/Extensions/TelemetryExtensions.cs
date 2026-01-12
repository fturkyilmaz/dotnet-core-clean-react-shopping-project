using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace ShoppingProject.Infrastructure.Extensions;

public static class TelemetryExtensions
{
    public static IServiceCollection AddTelemetry(
        this IServiceCollection services,
        string serviceName
    )
    {
        services
            .AddOpenTelemetry()
            .ConfigureResource(resource => resource.AddService(serviceName))
            .WithTracing(tracing =>
            {
                tracing
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddSource("MassTransit");

#if DEBUG
                // LOCAL
                tracing.AddConsoleExporter();
#else
                // PRODUCTION
                tracing.AddOtlpExporter();
#endif
            })
            .WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation();

#if DEBUG
                // LOCAL
                metrics.AddConsoleExporter();
#else
                // PRODUCTION
                metrics.AddOtlpExporter();
#endif
            });

        return services;
    }
}
