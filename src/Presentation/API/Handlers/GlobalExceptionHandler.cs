using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Exceptions;

namespace ShoppingProject.WebApi.Handlers;

/// <summary>
/// Global exception handler that converts unhandled exceptions to standardized RFC 7807 ProblemDetails responses.
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "An unhandled exception occurred: {ExceptionMessage}", exception.Message);

        var problemDetails = MapExceptionToProblemDetails(httpContext, exception);

        httpContext.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/problem+json";

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }

    /// <summary>
    /// Maps exceptions to ProblemDetails based on exception type and application logic.
    /// </summary>
    private ProblemDetails MapExceptionToProblemDetails(HttpContext httpContext, Exception exception)
    {
        var problemDetails = new ProblemDetails
        {
            Instance = httpContext.Request.Path,
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
        };

        switch (exception)
        {
            case NotFoundException notFoundException:
                problemDetails.Status = StatusCodes.Status404NotFound;
                problemDetails.Title = "Resource Not Found";
                problemDetails.Detail = notFoundException.Message;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
                break;

            case ForbiddenAccessException forbiddenException:
                problemDetails.Status = StatusCodes.Status403Forbidden;
                problemDetails.Title = "Access Forbidden";
                problemDetails.Detail = forbiddenException.Message;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3";
                break;

            case BadRequestException badRequestException:
                problemDetails.Status = StatusCodes.Status400BadRequest;
                problemDetails.Title = "Bad Request";
                problemDetails.Detail = badRequestException.Message;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                break;

            case ValidationException validationException:
                problemDetails.Status = StatusCodes.Status422UnprocessableEntity;
                problemDetails.Title = "Validation Failed";
                problemDetails.Detail = validationException.Message;
                problemDetails.Type = "https://tools.ietf.org/html/rfc4918#section-11.2";
                problemDetails.Extensions["errors"] = validationException.Errors;
                break;

            case UnauthorizedAccessException unauthorizedException:
                problemDetails.Status = StatusCodes.Status401Unauthorized;
                problemDetails.Title = "Unauthorized";
                problemDetails.Detail = unauthorizedException.Message;
                problemDetails.Type = "https://tools.ietf.org/html/rfc7235#section-3.1";
                break;

            default:
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Title = "Internal Server Error";
                problemDetails.Detail = "An internal server error occurred. Please try again later.";
                // Don't expose internal error details in production
                if (!httpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsProduction())
                {
                    problemDetails.Detail = exception.Message;
                    problemDetails.Extensions["stackTrace"] = exception.StackTrace;
                }
                break;
        }

        return problemDetails;
    }
}
