using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Infrastructure.Constants;
using ShoppingProject.WebApi.Middleware;
using Xunit;

public class ApiKeyMiddlewareTests
{
    private readonly Mock<ILogger<ApiKeyMiddleware>> _loggerMock;
    private readonly RequestDelegate _next;

    public ApiKeyMiddlewareTests()
    {
        _loggerMock = new Mock<ILogger<ApiKeyMiddleware>>();
        _next = (ctx) => Task.CompletedTask;
    }

    [Fact]
    public async Task InvokeAsync_InvalidApiKey_Returns401ProblemDetails()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        context.Request.Headers[ConfigurationConstants.ApiKey.HeaderName] = "wrong-key";

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new[]
                {
                    new KeyValuePair<string, string?>(
                        ConfigurationConstants.ApiKey.SectionName,
                        "expected-key"
                    ),
                }
            )
            .Build();

        context.RequestServices = new ServiceCollection()
            .AddSingleton<IConfiguration>(config)
            .BuildServiceProvider();

        var middleware = new ApiKeyMiddleware(_next, _loggerMock.Object);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        context.Response.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var problem = await JsonSerializer.DeserializeAsync<ProblemDetails>(
            context.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        problem.Should().NotBeNull();
        problem!.Title.Should().Be("Unauthorized");
        problem.Extensions["errorCode"]!.ToString().Should().Be("INVALID_API_KEY");
        problem.Extensions["errorType"]!.ToString().Should().Be(ErrorType.Unauthorized.ToString());
    }

    [Fact]
    public async Task InvokeAsync_ValidApiKey_CallsNextDelegate()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        context.Request.Headers[ConfigurationConstants.ApiKey.HeaderName] = "expected-key";

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new[]
                {
                    new KeyValuePair<string, string?>(
                        ConfigurationConstants.ApiKey.SectionName,
                        "expected-key"
                    ),
                }
            )
            .Build();

        context.RequestServices = new ServiceCollection()
            .AddSingleton<IConfiguration>(config)
            .BuildServiceProvider();

        bool nextCalled = false;
        var middleware = new ApiKeyMiddleware(
            ctx =>
            {
                nextCalled = true;
                return Task.CompletedTask;
            },
            _loggerMock.Object
        );

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        nextCalled.Should().BeTrue();
        context.Response.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
}
