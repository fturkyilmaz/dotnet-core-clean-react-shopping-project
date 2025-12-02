using System.IO;
using System.Text.Json;
using FluentAssertions;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.WebApi.Handlers;
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
        envMock.SetupGet(e => e.EnvironmentName).Returns("Development");
        _handler = new GlobalExceptionHandler(_loggerMock.Object, envMock.Object);
        _httpContext = new DefaultHttpContext { Response = { Body = new MemoryStream() } };
    }

    [Fact]
    public async Task TryHandleAsync_NotFoundException_Returns404ProblemDetails()
    {
        var exception = new NotFoundException("Product not found");

        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);

        _httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var problem = await JsonSerializer.DeserializeAsync<ExtendedProblemDetails>(
            _httpContext.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
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
        var failures = new List<ValidationFailure>
        {
            new ValidationFailure("Name", "Name is required"),
        };
        var exception = new ValidationException(failures);

        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status422UnprocessableEntity);

        _httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var problem = await JsonSerializer.DeserializeAsync<ExtendedProblemDetails>(
            _httpContext.Response.Body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        problem.Should().NotBeNull();
        problem!.ErrorCode.Should().Be("VALIDATION_ERROR");
        problem.Extensions.Should().ContainKey("errors");
    }
}
