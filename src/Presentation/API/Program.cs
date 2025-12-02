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

builder.Host.UseSerilog(
    (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
);

// Add OpenTelemetry
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

// Add Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<AspNetCoreRateLimit.IpRateLimitOptions>(
    builder.Configuration.GetSection(ConfigurationConstants.RateLimiting.IpRateLimiting)
);
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<
    AspNetCoreRateLimit.IRateLimitConfiguration,
    AspNetCoreRateLimit.RateLimitConfiguration
>();

// Add Caching
builder.Services.AddResponseCaching();
builder.Services.AddOutputCache(options =>
{
    // Default policy: cache for 60 seconds
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromSeconds(60)));

    // Products list policy: cache for 2 minutes
    options.AddPolicy(
        AppConstants.CachePolicies.ProductsList,
        builder => builder.Expire(TimeSpan.FromMinutes(2)).Tag(AppConstants.CacheTags.Products)
    );

    // Product detail policy: cache for 5 minutes with ETag
    options.AddPolicy(
        AppConstants.CachePolicies.ProductDetail,
        builder =>
            builder
                .Expire(TimeSpan.FromMinutes(5))
                .Tag(AppConstants.CacheTags.Products)
                .SetVaryByQuery("id")
    );
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddExceptionHandler<ShoppingProject.WebApi.Handlers.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Register dependencies And Use PostgreSQL Database
builder.AddInfrastructureServices();

builder.Services.AddApplicationServices();

// Add CORS for React frontend
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

builder.Services.AddConsulConfig(builder.Configuration);

// Add Hangfire services
builder.Services.Configure<HangfireOptions>(
    builder.Configuration.GetSection(HangfireOptions.SectionName)
);
builder.Services.AddHangfire(configuration =>
    configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options =>
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
    .AddRabbitMQ(async sp =>
    {
        var serviceBusOptions =
            builder.Configuration.GetSection(ServiceBusOptions.SectionName).Get<ServiceBusOptions>()
            ?? throw new InvalidOperationException("ServiceBus options not configured");

        if (string.IsNullOrEmpty(serviceBusOptions.Url))
            throw new InvalidOperationException("ServiceBus URL is not configured");

        var factory = new ConnectionFactory() { Uri = new Uri(serviceBusOptions.Url) };
        return await factory.CreateConnectionAsync();
    })
    .AddUrlGroup(
        new Uri(AppConstants.Observability.DefaultElasticsearchUrl),
        name: AppConstants.HealthCheckNames.Elasticsearch,
        tags: new[] { AppConstants.HealthCheckNames.Elasticsearch }
    );

builder.Services.AddHealthChecksUI().AddInMemoryStorage();

builder.Services.AddOptions<EmailOptions>().Bind(builder.Configuration.GetSection("Email"));

builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Add global exception handling middleware (RFC 7807 ProblemDetails)
app.UseExceptionHandler();

// Register with Consul
app.UseConsul(builder.Configuration);

// Configure the HTTP request pipeline.
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

    // Add Hangfire Dashboard (only in development for security)
    app.UseHangfireDashboard(
        builder.Configuration.GetValue<string>(
            ConfigurationConstants.Hangfire.DashboardPath,
            AppConstants.Endpoints.HangfireDashboard
        )
    );

    // Schedule Recurring Job with retry policy
    RecurringJob.AddOrUpdate<ShoppingProject.Infrastructure.Jobs.DatabaseBackupJob>(
        AppConstants.JobIds.DatabaseBackup,
        job => job.RunAsync(),
        Cron.Daily,
        new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
    );
}

// Add CorrelationId middleware early in pipeline
app.UseMiddleware<ShoppingProject.WebApi.Middleware.CorrelationIdMiddleware>();

app.UseHttpsRedirection();

// Security Headers
app.Use(
    async (context, next) =>
    {
        // HSTS - HTTP Strict Transport Security
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.StrictTransportSecurity,
            AppConstants.SecurityHeaders.StrictTransportSecurityValue
        );

        // Prevent MIME sniffing
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.XContentTypeOptions,
            AppConstants.SecurityHeaders.XContentTypeOptionsValue
        );

        // Prevent clickjacking
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.XFrameOptions,
            AppConstants.SecurityHeaders.XFrameOptionsValue
        );

        // XSS Protection
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.XXssProtection,
            AppConstants.SecurityHeaders.XXssProtectionValue
        );

        // Content Security Policy (improved - removed unsafe-inline)
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.ContentSecurityPolicy,
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
        );

        // Referrer Policy
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.ReferrerPolicy,
            AppConstants.SecurityHeaders.ReferrerPolicyValue
        );

        // Permissions Policy
        context.Response.Headers.Append(
            AppConstants.SecurityHeaders.PermissionsPolicy,
            AppConstants.SecurityHeaders.PermissionsPolicyValue
        );

        await next();
    }
);

// Rate Limiting
app.UseIpRateLimiting();

// Caching
app.UseResponseCaching();
app.UseOutputCache();

app.UseOpenTelemetryPrometheusScrapingEndpoint();

app.UseCors(AppConstants.CorsPolicies.AllowReactApp);
app.UseAuthentication();
app.UseAuthorization();

// Health Checks - Liveness (simple check if app is running)
app.MapHealthChecks(
    "/health/live",
    new HealthCheckOptions
    {
        Predicate = _ => false, // No checks, just returns healthy if app is running
    }
);

// Health Checks - Readiness (checks all dependencies)
app.MapHealthChecks(
    "/health/ready",
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    }
);

// Legacy health check endpoint (for backward compatibility)
app.MapHealthChecks(
    AppConstants.Endpoints.HealthCheck,
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    }
);
app.MapHealthChecksUI(options => options.UIPath = AppConstants.Endpoints.HealthCheckUI);

app.UseWebSockets();
app.UseMiddleware<ShoppingProject.WebApi.Middleware.WebSocketEchoMiddleware>();

// Map SignalR Hubs
app.MapHub<ShoppingProject.Infrastructure.Hubs.NotificationHub>(
    AppConstants.Endpoints.NotificationHub
);
app.MapHub<ShoppingProject.Infrastructure.Hubs.CartHub>(AppConstants.Endpoints.CartHub);
app.MapHub<ShoppingProject.Infrastructure.Hubs.OrderHub>(AppConstants.Endpoints.OrderHub);

app.MapControllers();

app.Run();
