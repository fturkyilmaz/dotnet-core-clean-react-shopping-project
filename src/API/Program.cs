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
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.WebApi;
using ShoppingProject.WebApi.Extensions;
using ShoppingProject.WebApi.Services;

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

        metrics.AddMeter("Microsoft.AspNetCore.Hosting", "Microsoft.AspNetCore.Server.Kestrel");
    })
    .WithTracing(tracing =>
    {
        tracing.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation();

        tracing.AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri("http://localhost:4317");
        });
    });

// Add Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<AspNetCoreRateLimit.IpRateLimitOptions>(
    builder.Configuration.GetSection("IpRateLimiting")
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
        "ProductsList",
        builder => builder.Expire(TimeSpan.FromMinutes(2)).Tag("products")
    );

    // Product detail policy: cache for 5 minutes with ETag
    options.AddPolicy(
        "ProductDetail",
        builder => builder.Expire(TimeSpan.FromMinutes(5)).Tag("products").SetVaryByQuery("id")
    );
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
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
builder.Services.AddScoped<IUser, CurrentUser>();
builder.Services.AddHttpContextAccessor();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReactApp",
        policy =>
        {
            var allowedOrigins =
                builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                ?? Array.Empty<string>();
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        }
    );
});

builder.Services.AddBusExt(builder.Configuration);

builder.Services.AddConsulConfig(builder.Configuration);

// Add Hangfire services
builder.Services.AddHangfire(configuration =>
    configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options =>
            options.UseNpgsqlConnection(
                builder.Configuration.GetSection("Hangfire:ConnectionString").Value
            )
        )
);

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = builder.Configuration.GetValue<int>("Hangfire:WorkerCount", 5);
});

builder
    .Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!)
    .AddRedis(builder.Configuration.GetConnectionString("RedisConnection")!)
    .AddRabbitMQ(sp =>
    {
        var factory = new ConnectionFactory()
        {
            Uri = new Uri(builder.Configuration["ServiceBusOption:Url"]!),
        };
        return factory.CreateConnectionAsync().GetAwaiter().GetResult();
    })
    .AddUrlGroup(
        new Uri("http://localhost:9200"),
        name: "elasticsearch",
        tags: new[] { "elasticsearch" }
    );

builder.Services.AddHealthChecksUI().AddInMemoryStorage();

// ... (existing code)

var app = builder.Build();

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

    // Add Hangfire Dashboard
    app.UseHangfireDashboard(
        builder.Configuration.GetValue<string>("Hangfire:DashboardPath", "/hangfire")
    );

    // Schedule Recurring Job
    RecurringJob.AddOrUpdate<ShoppingProject.Infrastructure.Jobs.DatabaseBackupJob>(
        "database-backup",
        job => job.RunAsync(),
        Cron.Daily
    );
}

app.UseHttpsRedirection();

// Security Headers
app.Use(
    async (context, next) =>
    {
        // HSTS - HTTP Strict Transport Security
        context.Response.Headers.Append(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains"
        );

        // Prevent MIME sniffing
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

        // Prevent clickjacking
        context.Response.Headers.Append("X-Frame-Options", "DENY");

        // XSS Protection
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

        // Content Security Policy
        context.Response.Headers.Append(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
        );

        // Referrer Policy
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions Policy
        context.Response.Headers.Append(
            "Permissions-Policy",
            "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
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

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks(
    "/health",
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    }
);
app.MapHealthChecksUI(options => options.UIPath = "/health-ui");

app.UseWebSockets();
app.UseMiddleware<ShoppingProject.WebApi.Middleware.WebSocketEchoMiddleware>();

// Map SignalR Hubs
app.MapHub<ShoppingProject.Infrastructure.Hubs.NotificationHub>("/hubs/notifications");
app.MapHub<ShoppingProject.Infrastructure.Hubs.CartHub>("/hubs/cart");
app.MapHub<ShoppingProject.Infrastructure.Hubs.OrderHub>("/hubs/orders");

app.MapControllers();
app.Run();
