using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Infrastructure.Constants;

namespace ShoppingProject.WebApi.Middleware;

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiKeyMiddleware> _logger;

    public ApiKeyMiddleware(RequestDelegate next, ILogger<ApiKeyMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (
            !context.Request.Headers.TryGetValue(
                ConfigurationConstants.ApiKey.HeaderName,
                out var extractedApiKey
            )
        )
        {
            _logger.LogWarning(
                "API Key missing from request. IP: {IpAddress}, Path: {Path}",
                context.Connection.RemoteIpAddress,
                context.Request.Path
            );

            await WriteProblemDetails(
                context,
                StatusCodes.Status401Unauthorized,
                "API Key Missing",
                "API Key was not provided",
                ErrorType.Unauthorized,
                "API_KEY_MISSING"
            );
            return;
        }

        var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
        var apiKey = appSettings.GetValue<string>(ConfigurationConstants.ApiKey.SectionName);

        if (
            string.IsNullOrEmpty(apiKey)
            || !apiKey.Equals(extractedApiKey, StringComparison.Ordinal)
        )
        {
            _logger.LogWarning(
                "Unauthorized API access attempt with invalid API key. IP: {IpAddress}, Path: {Path}",
                context.Connection.RemoteIpAddress,
                context.Request.Path
            );

            await WriteProblemDetails(
                context,
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                "Invalid API Key",
                ErrorType.Unauthorized,
                "INVALID_API_KEY"
            );
            return;
        }

        await _next(context);
    }

    private static async Task WriteProblemDetails(
        HttpContext context,
        int status,
        string title,
        string detail,
        ErrorType errorType,
        string errorCode
    )
    {
        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path,
            Type = ConfigurationConstants.RfcTypes.Unauthorized,
        };

        problem.Extensions["errorType"] = errorType.ToString();
        problem.Extensions["errorCode"] = errorCode;

        // Add correlation ID for request tracking
        if (
            context.Items.TryGetValue(
                ConfigurationConstants.CorrelationId.ItemsKey,
                out var correlationId
            )
        )
        {
            problem.Extensions["correlationId"] = correlationId?.ToString() ?? string.Empty;
        }

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem);
    }
}
