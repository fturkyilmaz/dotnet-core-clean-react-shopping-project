using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ShoppingProject.Infrastructure.Data;
using Testcontainers.PostgreSql;
using Xunit;

namespace ShoppingProject.IntegrationTests.Fixtures;

/// <summary>
/// Integration test fixture using Testcontainers for PostgreSQL database.
/// Provides isolated database instance for each test run.
/// </summary>
public class IntegrationTestFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgresContainer;
    private WebApplicationFactory<Program>? _factory;

    public HttpClient HttpClient => _factory?.CreateClient()
        ?? throw new InvalidOperationException("Factory not initialized");

    public IServiceProvider Services => _factory?.Services
        ?? throw new InvalidOperationException("Factory not initialized");

    public IntegrationTestFixture()
    {
        _postgresContainer = new PostgreSqlBuilder()
            .WithDatabase("shopping_test")
            .WithUsername("test")
            .WithPassword("test")
            .WithImage("postgres:15-alpine")
            .Build();
    }

    public async Task InitializeAsync()
    {
        // Start PostgreSQL container
        await _postgresContainer.StartAsync();

        // Create WebApplicationFactory with test configuration
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");

                builder.ConfigureServices(services =>
                {
                    // Remove existing DbContext registration
                    services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
                    services.RemoveAll<ApplicationDbContext>();

                    // Add PostgreSQL with Testcontainers connection string
                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseNpgsql(_postgresContainer.GetConnectionString());
                    });

                    // Ensure database is created and migrations are applied
                    var sp = services.BuildServiceProvider();
                    using var scope = sp.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    context.Database.Migrate();
                });
            });
    }

    public async Task DisposeAsync()
    {
        if (_factory != null)
        {
            await _factory.DisposeAsync();
        }

        await _postgresContainer.DisposeAsync();
    }

    /// <summary>
    /// Resets the database to a clean state for each test.
    /// </summary>
    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Clear all data but keep schema
        await context.Database.ExecuteSqlRawAsync(@"
            TRUNCATE TABLE ""Products"", ""Carts"", ""FeatureFlags"", ""OutboxMessages"", ""AuditLogs"" RESTART IDENTITY CASCADE;
        ");
    }
}

/// <summary>
/// Collection fixture for sharing the IntegrationTestFixture across test classes.
/// </summary>
[CollectionDefinition("Integration Tests")]
public class IntegrationTestCollection : ICollectionFixture<IntegrationTestFixture>
{
}
