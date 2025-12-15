using Asp.Versioning;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.WebApi.Extensions;
using ShoppingProject.WebApi.Handlers;

namespace ShoppingProject.WebApi;

public static class DependencyInjection
{
    public static void AddWebApiServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        // Controllers & Validation
        services.AddControllers();
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<Program>();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        // Swagger
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.ConfigureOptions<ConfigureSwaggerOptions>();

        // API Versioning
        services
            .AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
            })
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

        // SignalR
        services.AddSignalR();

        // CORS
        services.AddCors(options =>
        {
            options.AddPolicy(
                AppConstants.CorsPolicies.AllowReactApp,
                policy =>
                {
                    var allowedOrigins =
                        configuration
                            .GetSection(ConfigurationConstants.Cors.AllowedOrigins)
                            .Get<string[]>()
                        ?? Array.Empty<string>();
                    policy
                        .WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }
            );
        });
    }
}
