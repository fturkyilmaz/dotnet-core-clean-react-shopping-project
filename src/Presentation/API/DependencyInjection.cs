using Asp.Versioning;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.OpenApi;
using ShoppingProject.Infrastructure.Constants;
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
        const string schemeId = "bearer";
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(schemeId, new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = schemeId, // lowercase per RFC 7235
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "JWT Authorization header using Bearer scheme",
                Name = "Authorization",
            });

            options.AddSecurityRequirement(document => new() { [new OpenApiSecuritySchemeReference("Bearer", document)] = [] });
        });


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
