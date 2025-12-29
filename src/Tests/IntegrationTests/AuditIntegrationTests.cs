using System.Net.Http.Json;
using Bogus;
using MassTransit;
using MassTransit.Testing;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.Contracts.Audit;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Bus.Events;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.UnitTests.IntegrationTests;

public class AuditIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly Faker _faker = new();

    public AuditIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task SaveEntity_Should_Publish_IAuditEvent()
    {
        // Arrange
        var factory = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration(
                (context, config) =>
                {
                    config.AddInMemoryCollection(
                        new Dictionary<string, string?>
                        {
                            {
                                "ConnectionStrings:AuditConnection",
                                "Host=localhost;Database=AuditDb;Username=postgres;Password=postgres"
                            },
                        }
                    );
                }
            );
            builder.ConfigureServices(services =>
            {
                services.AddMassTransitTestHarness();
            });
        });

        var client = factory.CreateClient();
        using (var scope = factory.Services.CreateScope())
        {
            var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
            await initialiser.InitialiseAsync();
        }
        
        var harness = factory.Services.GetRequiredService<ITestHarness>();

        // Login as admin
        var loginResponse = await client.PostAsJsonAsync(
            "/api/v1/identity/login",
            new { Email = "admin@test.com", Password = "Admin123!" }
        );
        var loginResult = await loginResponse.Content.ReadFromJsonAsync<
            ServiceResult<AuthResponse>
        >();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer",
                loginResult!.Data!.AccessToken
            );

        // Act
        var createResponse = await client.PostAsJsonAsync(
            "/api/v1/products",
            new
            {
                Title = _faker.Commerce.ProductName(),
                Price = 100.0,
                Description = "Test audit",
                Category = "electronics",
                Image = "https://example.com/img.jpg",
            }
        );

        // Assert
        if (!createResponse.IsSuccessStatusCode)
        {
            var error = await createResponse.Content.ReadAsStringAsync();
            throw new Exception(
                $"Product creation failed with status {createResponse.StatusCode}. Error: {error}"
            );
        }
        createResponse.EnsureSuccessStatusCode();

        // Wait for the audit event to be published
        Assert.True(
            await harness.Published.Any<IAuditEvent>(x => x.Context.Message.EntityName == "Product")
        );

        // Verify database persistence
        using (var scope = factory.Services.CreateScope())
        {
            var auditContext = scope.ServiceProvider.GetRequiredService<IAuditDbContext>();
            var auditLog = await ((AuditDbContext)auditContext).AuditLogs
                .OrderByDescending(x => x.Timestamp)
                .FirstOrDefaultAsync();

            Assert.NotNull(auditLog);
            Assert.Equal("Product", auditLog.EntityName);
            Assert.Equal("Added", auditLog.Action);
            Assert.NotNull(auditLog.Hash);
            Assert.NotNull(auditLog.PreviousHash);
        }

        var publishedMessage = harness.Published.Select<IAuditEvent>().First();
        Assert.Equal("Added", publishedMessage.Context.Message.Action);
        Assert.Equal("Product", publishedMessage.Context.Message.EntityName);
        Assert.NotNull(publishedMessage.Context.Message.CorrelationId);
    }
    }
}
