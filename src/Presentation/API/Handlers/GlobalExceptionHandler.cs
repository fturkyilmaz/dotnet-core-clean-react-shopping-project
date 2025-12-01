using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Constants;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Domain.Enums;

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
                RfcTypes.NotFound,
                ErrorType.NotFound
            ),
            ForbiddenAccessException forbidden => CreateProblem(
                httpContext,
                StatusCodes.Status403Forbidden,
                "Access Forbidden",
                forbidden.Message,
                RfcTypes.Forbidden,
                ErrorType.Forbidden
            ),
            BadRequestException badRequest => CreateProblem(
                httpContext,
                StatusCodes.Status400BadRequest,
                "Bad Request",
                badRequest.Message,
                RfcTypes.BadRequest,
                ErrorType.Conflict
            ),
            ValidationException validation => CreateProblem(
                httpContext,
                StatusCodes.Status422UnprocessableEntity,
                "Validation Failed",
                validation.Message,
                RfcTypes.Validation,
                ErrorType.Validation,
                ("errors", validation.Errors)
            ),
            UnauthorizedAccessException unauthorized => CreateProblem(
                httpContext,
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                unauthorized.Message,
                RfcTypes.Unauthorized,
                ErrorType.Unauthorized
            ),
            _ => CreateDefaultProblem(httpContext, exception),
        };
    }

    private ProblemDetails CreateProblem(
        HttpContext httpContext,
        int status,
        string title,
        string detail,
        string type,
        ErrorType errorType,
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

        // Domain-specific error type
        problem.Extensions["errorType"] = errorType.ToString();

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
            Type = RfcTypes.InternalServerError,
        };

        problem.Extensions["errorType"] = ErrorType.Internal.ToString();

        if (!_environment.IsProduction())
        {
            problem.Extensions["stackTrace"] = exception.StackTrace;
        }

        return problem;
    }
}
