using ShoppingProject.Infrastructure.Constants;

namespace ShoppingProject.WebApi.Middleware;

/// <summary>
/// Middleware to extract or generate a correlation ID for request tracking across distributed systems.
/// </summary>
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CorrelationIdMiddleware> _logger;

    public CorrelationIdMiddleware(RequestDelegate next, ILogger<CorrelationIdMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Extract correlation ID from request header or generate a new one
        var correlationId =
            context
                .Request.Headers[ConfigurationConstants.CorrelationId.HeaderName]
                .FirstOrDefault()
            ?? Guid.NewGuid().ToString();

        // Store in HttpContext.Items for access throughout the request pipeline
        context.Items[ConfigurationConstants.CorrelationId.ItemsKey] = correlationId;

        // Add to response headers for client tracking
        context.Response.OnStarting(() =>
        {
            if (
                !context.Response.Headers.ContainsKey(
                    ConfigurationConstants.CorrelationId.HeaderName
                )
            )
            {
                context.Response.Headers.Append(
                    ConfigurationConstants.CorrelationId.HeaderName,
                    correlationId
                );
            }
            return Task.CompletedTask;
        });

        // Add to logging scope for all logs in this request
        using (
            _logger.BeginScope(
                new Dictionary<string, object>
                {
                    [ConfigurationConstants.CorrelationId.ItemsKey] = correlationId,
                }
            )
        )
        {
            await _next(context);
        }
    }
}
