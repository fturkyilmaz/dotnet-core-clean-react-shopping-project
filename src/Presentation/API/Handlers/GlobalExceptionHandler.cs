using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Infrastructure.Constants;

namespace ShoppingProject.WebApi.Handlers;

/// <summary>
/// Global exception handler that converts unhandled exceptions to standardized RFC 7807 ProblemDetails responses.
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger,
        IHostEnvironment environment
    )
    {
        _logger = logger;
        _environment = environment;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        LogException(exception);

        var problemDetails = MapExceptionToProblemDetails(httpContext, exception);

        httpContext.Response.StatusCode =
            problemDetails.Status ?? StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/problem+json";

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }

    private void LogException(Exception exception)
    {
        switch (exception)
        {
            case NotFoundException:
                _logger.LogWarning(exception, "Resource not found: {Message}", exception.Message);
                break;
            case BadRequestException:
            case ValidationException:
                _logger.LogWarning(exception, "Bad request: {Message}", exception.Message);
                break;
            case ForbiddenAccessException:
            case UnauthorizedAccessException:
                _logger.LogWarning(exception, "Access issue: {Message}", exception.Message);
                break;
            default:
                _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
                break;
        }
    }

    private ProblemDetails MapExceptionToProblemDetails(
        HttpContext httpContext,
        Exception exception
    )
    {
        return exception switch
        {
            NotFoundException notFound => CreateProblem(
                httpContext,
                StatusCodes.Status404NotFound,
                "Resource Not Found",
                notFound.Message,
                ConfigurationConstants.RfcTypes.NotFound,
                ErrorType.NotFound,
                "NOT_FOUND"
            ),
            ForbiddenAccessException forbidden => CreateProblem(
                httpContext,
                StatusCodes.Status403Forbidden,
                "Access Forbidden",
                forbidden.Message,
                ConfigurationConstants.RfcTypes.Forbidden,
                ErrorType.Forbidden,
                "FORBIDDEN"
            ),
            BadRequestException badRequest => CreateProblem(
                httpContext,
                StatusCodes.Status400BadRequest,
                "Bad Request",
                badRequest.Message,
                ConfigurationConstants.RfcTypes.BadRequest,
                ErrorType.Conflict,
                "BAD_REQUEST"
            ),
            ValidationException validation => CreateProblem(
                httpContext,
                StatusCodes.Status422UnprocessableEntity,
                "Validation Failed",
                validation.Message,
                ConfigurationConstants.RfcTypes.Validation,
                ErrorType.Validation,
                "VALIDATION_ERROR",
                ("errors", validation.Errors)
            ),
            UnauthorizedAccessException unauthorized => CreateProblem(
                httpContext,
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                unauthorized.Message,
                ConfigurationConstants.RfcTypes.Unauthorized,
                ErrorType.Unauthorized,
                "UNAUTHORIZED"
            ),
            _ => CreateDefaultProblem(httpContext, exception),
        };
    }

    public ProblemDetails CreateProblem(
        HttpContext httpContext,
        int status,
        string title,
        string detail,
        string type,
        ErrorType errorType,
        string errorCode,
        (string key, object value)? extension = null
    )
    {
        var problem = new ProblemDetails
        {
            Instance = httpContext.Request.Path,
            Status = status,
            Title = title,
            Detail = detail,
            Type = type,
        };

        problem.Extensions["errorType"] = errorType.ToString();
        problem.Extensions["errorCode"] = errorCode;

        // Add correlation ID for request tracking
        if (
            httpContext.Items.TryGetValue(
                ConfigurationConstants.CorrelationId.ItemsKey,
                out var correlationId
            )
        )
        {
            problem.Extensions["correlationId"] = correlationId?.ToString() ?? string.Empty;
        }

        if (extension.HasValue)
        {
            problem.Extensions[extension.Value.key] = extension.Value.value;
        }

        return problem;
    }

    private ProblemDetails CreateDefaultProblem(HttpContext httpContext, Exception exception)
    {
        var problem = new ProblemDetails
        {
            Instance = httpContext.Request.Path,
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error",
            Detail = _environment.IsProduction()
                ? "An internal server error occurred. Please try again later."
                : exception.Message,
            Type = ConfigurationConstants.RfcTypes.InternalServerError,
        };

        problem.Extensions["errorType"] = ErrorType.Internal.ToString();
        problem.Extensions["errorCode"] = "INTERNAL_SERVER_ERROR";

        if (
            httpContext.Items.TryGetValue(
                ConfigurationConstants.CorrelationId.ItemsKey,
                out var correlationId
            )
        )
        {
            problem.Extensions["correlationId"] = correlationId?.ToString() ?? string.Empty;
        }

        if (!_environment.IsProduction())
        {
            problem.Extensions["stackTrace"] = exception.StackTrace;
        }

        return problem;
    }
}
