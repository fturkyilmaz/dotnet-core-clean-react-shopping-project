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

    public ApiKeyMiddleware(RequestDelegate next)
    {
        _next = next;
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
            await WriteProblemDetails(
                context,
                StatusCodes.Status401Unauthorized,
                "API Key Missing",
                "Api Key was not provided",
                ErrorType.Unauthorized
            );
            return;
        }

        var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
        var apiKey = appSettings.GetValue<string>(ConfigurationConstants.ApiKey.SectionName);

        if (string.IsNullOrEmpty(apiKey) || !apiKey.Equals(extractedApiKey))
        {
            await WriteProblemDetails(
                context,
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                "Invalid API Key",
                ErrorType.Unauthorized
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
        ErrorType errorType
    )
    {
        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path,
            Type = "https://tools.ietf.org/html/rfc7235#section-3.1",
        };

        problem.Extensions["errorType"] = errorType.ToString();

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem);
    }
}
