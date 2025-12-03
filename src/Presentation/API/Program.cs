using Asp.Versioning;
using AspNetCoreRateLimit;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.PostgreSql;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using RabbitMQ.Client;
using Serilog;
using ShoppingProject.Application;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Bus;
using ShoppingProject.Infrastructure.Configuration;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.Infrastructure.Services;
using ShoppingProject.WebApi;
using ShoppingProject.WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Host.UseSerilog(
    (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
);

// OpenTelemetry
builder
    .Services.AddOpenTelemetry()
    .WithMetrics(metrics =>
    {
        metrics.AddAspNetCoreInstrumentation().AddPrometheusExporter();
        metrics.AddMeter(AppConstants.Metrics.AspNetCoreHosting, AppConstants.Metrics.Kestrel);
    })
    .WithTracing(tracing =>
    {
        tracing.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation();
        tracing.AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri(AppConstants.Observability.DefaultOtlpEndpoint);
        });
    });

// Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(
    builder.Configuration.GetSection(ConfigurationConstants.RateLimiting.IpRateLimiting)
);

if (builder.Environment.IsProduction())
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.RedisConnection
        );
        options.InstanceName = "RateLimiting:";
    });
    builder.Services.AddDistributedRateLimiting();
}
else
{
    builder.Services.AddInMemoryRateLimiting();
}

builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// Caching
builder.Services.AddResponseCaching();
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromSeconds(60)));
    options.AddPolicy(
        AppConstants.CachePolicies.ProductsList,
        builder => builder.Expire(TimeSpan.FromMinutes(2)).Tag(AppConstants.CacheTags.Products)
    );
    options.AddPolicy(
        AppConstants.CachePolicies.ProductDetail,
        builder =>
            builder
                .Expire(TimeSpan.FromMinutes(5))
                .Tag(AppConstants.CacheTags.Products)
                .SetVaryByQuery("id")
    );
});

// Config Validation
builder
    .Services.AddOptions<RabbitMqOptions>()
    .Bind(builder.Configuration.GetSection(RabbitMqOptions.SectionName))
    .ValidateFluently()
    .ValidateOnStart();

builder
    .Services.AddOptions<RedisOptions>()
    .Bind(builder.Configuration.GetSection(RedisOptions.SectionName))
    .ValidateFluently()
    .ValidateOnStart();

builder
    .Services.AddOptions<PostgresOptions>()
    .Bind(builder.Configuration.GetSection(PostgresOptions.SectionName))
    .ValidateFluently()
    .ValidateOnStart();

// Controllers & Validation
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddExceptionHandler<ShoppingProject.WebApi.Handlers.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// API Versioning
builder
    .Services.AddApiVersioning(options =>
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

builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();

// Infrastructure & Application
builder.AddInfrastructureServices();
builder.Services.AddApplicationServices();

// CORS (tek policy)
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        AppConstants.CorsPolicies.AllowReactApp,
        policy =>
        {
            var allowedOrigins =
                builder
                    .Configuration.GetSection(ConfigurationConstants.Cors.AllowedOrigins)
                    .Get<string[]>()
                ?? Array.Empty<string>();

            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        }
    );
});

builder.Services.AddBusExt(builder.Configuration);

// Consul sadece production’da
if (builder.Environment.IsProduction())
{
    builder.Services.AddConsulConfig(builder.Configuration);
}

// Hangfire
builder.Services.Configure<HangfireOptions>(
    builder.Configuration.GetSection(HangfireOptions.SectionName)
);
builder.Services.AddHangfire(configuration =>
    configuration.UsePostgreSqlStorage(options =>
    {
        var hangfireOptions =
            builder.Configuration.GetSection(HangfireOptions.SectionName).Get<HangfireOptions>()
            ?? throw new InvalidOperationException("Hangfire options not configured");
        options.UseNpgsqlConnection(hangfireOptions.ConnectionString);
    })
);
builder.Services.AddHangfireServer(options =>
{
    var hangfireOptions =
        builder.Configuration.GetSection(HangfireOptions.SectionName).Get<HangfireOptions>()
        ?? throw new InvalidOperationException("Hangfire options not configured");
    options.WorkerCount = hangfireOptions.WorkerCount;
});

// HealthChecks
builder
    .Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.DefaultConnection
        )!
    )
    .AddRedis(
        builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.RedisConnection
        )!
    )
    .AddRabbitMQ(
        builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.RabbitMqConnection
        )!,
        name: "rabbitmq",
        tags: new[] { "ready" }
    )
    .AddUrlGroup(
        new Uri(AppConstants.Observability.DefaultElasticsearchUrl),
        name: AppConstants.HealthCheckNames.Elasticsearch,
        tags: new[] { AppConstants.HealthCheckNames.Elasticsearch }
    );

builder.Services.AddHealthChecksUI().AddInMemoryStorage();

// Email
builder.Services.AddOptions<EmailOptions>().Bind(builder.Configuration.GetSection("Email"));
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Exception Handling
app.UseExceptionHandler();

// Consul sadece production’da
if (app.Environment.IsProduction())
{
    app.UseConsul(builder.Configuration);
}

// Dev tools
if (app.Environment.IsDevelopment())
{
    app.UseSerilogRequestLogging();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        var descriptions = app.DescribeApiVersions();
        foreach (var description in descriptions)
        {
            options.SwaggerEndpoint(
                $"/swagger/{description.GroupName}/swagger.json",
                description.GroupName.ToUpperInvariant()
            );
        }
    });

    app.UseHangfireDashboard(
        builder.Configuration.GetValue<string>(
            ConfigurationConstants.Hangfire.DashboardPath,
            AppConstants.Endpoints.HangfireDashboard
        )
    );
}

// CorrelationId
app.UseMiddleware<ShoppingProject.WebApi.Middleware.CorrelationIdMiddleware>();
app.UseHttpsRedirection();

// Security Headers (CSP frontend origin eklendi)
app.Use(
    async (context, next) =>
    {
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.StrictTransportSecurity,
            AppConstants.SecurityHeaders.StrictTransportSecurityValue
        );
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.XContentTypeOptions,
            AppConstants.SecurityHeaders.XContentTypeOptionsValue
        );
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.XFrameOptions,
            AppConstants.SecurityHeaders.XFrameOptionsValue
        );
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.XXssProtection,
            AppConstants.SecurityHeaders.XXssProtectionValue
        );
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.ContentSecurityPolicy,
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:5173"
        );
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.ReferrerPolicy,
            AppConstants.SecurityHeaders.ReferrerPolicyValue
        );
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.PermissionsPolicy,
            AppConstants.SecurityHeaders.PermissionsPolicyValue
        );
        await next();
    }
);

// Pipeline
app.UseIpRateLimiting();
app.UseResponseCaching();
app.UseOutputCache();
app.UseOpenTelemetryPrometheusScrapingEndpoint();
app.UseCors(AppConstants.CorsPolicies.AllowReactApp);
app.UseAuthentication();
app.UseAuthorization();

// Health endpoints
app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks(
    "/health/ready",
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    }
);
app.MapHealthChecks(
    AppConstants.Endpoints.HealthCheck,
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    }
);
app.MapHealthChecksUI(options => options.UIPath = AppConstants.Endpoints.HealthCheckUI);

// SignalR
app.UseWebSockets();
app.UseMiddleware<ShoppingProject.WebApi.Middleware.WebSocketEchoMiddleware>();
app.MapHub<ShoppingProject.Infrastructure.Hubs.NotificationHub>(
    AppConstants.Endpoints.NotificationHub
);
app.MapHub<ShoppingProject.Infrastructure.Hubs.CartHub>(AppConstants.Endpoints.CartHub);
app.MapHub<ShoppingProject.Infrastructure.Hubs.OrderHub>(AppConstants.Endpoints.OrderHub);

app.MapControllers();
app.Run();
