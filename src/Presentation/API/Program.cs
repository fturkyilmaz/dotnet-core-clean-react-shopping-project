using AspNetCoreRateLimit;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using RabbitMQ.Client;
using Serilog;
using ShoppingProject.Application;
using ShoppingProject.Infrastructure;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Identity;
using ShoppingProject.WebApi;
using ShoppingProject.WebApi.Middleware;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Rate limiting services
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Host.UseSerilog(
    (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
);

// DI extension
builder.AddInfrastructureServices();
builder.Services.AddApplicationServices();
builder.Services.AddWebApiServices(builder.Configuration);

// OutputCache
builder.Services.AddOutputCache();

// Health Checks
builder
    .Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.DefaultConnection
        )!,
        name: "postgres",
        tags: new[] { "ready" }
    )
    .AddRedis(
        builder.Configuration.GetConnectionString(
            ConfigurationConstants.ConnectionStrings.RedisConnection
        )!,
        name: "redis",
        tags: new[] { "ready" }
    )
    .AddRabbitMQ(
        sp =>
        {
            var connStr = builder.Configuration.GetConnectionString(
                ShoppingProject
                    .Infrastructure
                    .Constants
                    .ConfigurationConstants
                    .ConnectionStrings
                    .RabbitMqConnection
            )!;

            var factory = new ConnectionFactory
            {
                Uri = new Uri(connStr),
                AutomaticRecoveryEnabled = true,
                TopologyRecoveryEnabled = true,
            };

            // v7+ için: sadece async bağlantı mevcut
            return factory.CreateConnectionAsync().GetAwaiter().GetResult();
        },
        name: "rabbitmq",
        tags: new[] { "ready" }
    );

builder.Services.AddHealthChecksUI().AddInMemoryStorage();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        app.DescribeApiVersions()
            .Select(d => d.GroupName)
            .ToList()
            .ForEach(groupName =>
                options.SwaggerEndpoint(
                    $"/swagger/{groupName}/swagger.json",
                    groupName.ToUpperInvariant()
                )
            );
    });
}

// Initialize AuditDb database
await InitializeAuditDatabaseAsync(builder.Configuration);

// Seed Identity data
using (var scope = app.Services.CreateScope())
{
    await DataSeeder.SeedAsync(scope.ServiceProvider, app.Environment.IsDevelopment());
}

// Rate Limiting
app.UseIpRateLimiting();

// Middleware pipeline
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseSerilogRequestLogging();
app.UseCors(AppConstants.CorsPolicies.AllowReactApp);
app.UseAuthentication();
app.UseAuthorization();

// OutputCache middleware
app.UseOutputCache();
app.UseResponseCaching();

app.MapControllers();
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
app.UseMiddleware<WebSocketEchoMiddleware>();

app.MapHub<ShoppingProject.Infrastructure.Hubs.NotificationHub>("/hubs/notifications");
await app.RunAsync();

// Initialize AuditDb database if it doesn't exist
static async Task InitializeAuditDatabaseAsync(IConfiguration configuration)
{
    var connectionString = configuration.GetConnectionString("AuditConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        Log.Warning("AuditConnection string not found. Skipping AuditDb initialization.");
        return;
    }

    try
    {
        // Extract server connection string (without database name)
        var builder = new NpgsqlConnectionStringBuilder(connectionString);
        var databaseName = builder.Database;
        builder.Database = "postgres"; // Connect to default database to create our database

        await using var connection = new NpgsqlConnection(builder.ConnectionString);
        await connection.OpenAsync();

        // Check if database exists
        await using (var checkCmd = new NpgsqlCommand(
            $"SELECT 1 FROM pg_database WHERE datname = '{databaseName}'", connection))
        {
            var result = await checkCmd.ExecuteScalarAsync();
            if (result == null)
            {
                // Create database
                await using (var createCmd = new NpgsqlCommand(
                    $"CREATE DATABASE \"{databaseName}\"", connection))
                {
                    await createCmd.ExecuteNonQueryAsync();
                    Log.Information("Created AuditDb database successfully.");
                }
            }
        }

        // Now connect to the actual AuditDb and create schema
        builder.Database = databaseName;
        await connection.CloseAsync();
        await connection.OpenAsync();

        // Create the AuditLogs table if it doesn't exist using raw SQL
        var createTableSql = @"
            CREATE TABLE IF NOT EXISTS ""AuditLogs"" (
                ""Id"" uuid NOT NULL PRIMARY KEY,
                ""UserId"" uuid,
                ""UserName"" character varying(256),
                ""Action"" character varying(100) NOT NULL,
                ""EntityName"" character varying(100),
                ""EntityId"" character varying(100),
                ""OldValues"" text,
                ""NewValues"" text,
                ""IpAddress"" character varying(50),
                ""UserAgent"" text,
                ""Timestamp"" timestamp with time zone NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS ""IX_AuditLogs_Timestamp"" ON ""AuditLogs""(""Timestamp"");
            CREATE INDEX IF NOT EXISTS ""IX_AuditLogs_UserId"" ON ""AuditLogs""(""UserId"");
            CREATE INDEX IF NOT EXISTS ""IX_AuditLogs_Action"" ON ""AuditLogs""(""Action"");
        ";

        await using var createTableCmd = new NpgsqlCommand(createTableSql, connection);

        await createTableCmd.ExecuteNonQueryAsync();
        Log.Information("AuditDb database initialized successfully.");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Failed to initialize AuditDb database: {Message}", ex.Message);
    }
}
