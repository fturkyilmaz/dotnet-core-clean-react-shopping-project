using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Handlers;
using Xunit;

public class GlobalExceptionHandlerTests
{
    private readonly Mock<ILogger<GlobalExceptionHandler>> _loggerMock;
    private readonly GlobalExceptionHandler _handler;
    private readonly DefaultHttpContext _httpContext;

    public GlobalExceptionHandlerTests()
    {
        _loggerMock = new Mock<ILogger<GlobalExceptionHandler>>();
        var envMock = new Mock<IHostEnvironment>();
        envMock.Setup(e => e.IsProduction()).Returns(false);

        _handler = new GlobalExceptionHandler(_loggerMock.Object, envMock.Object);
        _httpContext = new DefaultHttpContext();
    }

    [Fact]
    public async Task TryHandleAsync_NotFoundException_Returns404ProblemDetails()
    {
        // Arrange
        var exception = new NotFoundException("Product not found");

        // Act
        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);

        // Deserialize response body
        _httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var problem =
            await System.Text.Json.JsonSerializer.DeserializeAsync<ExtendedProblemDetails>(
                _httpContext.Response.Body
            );

        problem.Should().NotBeNull();
        problem!.Status.Should().Be(StatusCodes.Status404NotFound);
        problem.Title.Should().Be("Resource Not Found");
        problem.ErrorCode.Should().Be("NOT_FOUND");
        problem.Detail.Should().Be("Product not found");
    }

    [Fact]
    public async Task TryHandleAsync_ValidationException_Returns422ProblemDetailsWithErrors()
    {
        // Arrange
        var exception = new ValidationException(
            new Dictionary<string, string[]> { { "Name", new[] { "Name is required" } } }
        );

        // Act
        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status422UnprocessableEntity);

        _httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var problem =
            await System.Text.Json.JsonSerializer.DeserializeAsync<ExtendedProblemDetails>(
                _httpContext.Response.Body
            );

        problem.Should().NotBeNull();
        problem!.ErrorCode.Should().Be("VALIDATION_ERROR");
        problem.Extensions.Should().ContainKey("errors");
    }
}
