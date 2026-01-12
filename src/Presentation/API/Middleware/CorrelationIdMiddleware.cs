using Microsoft.AspNetCore.Http;
using ShoppingProject.Infrastructure.Services;

namespace ShoppingProject.WebApi.Middleware;

public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (
            !context.Request.Headers.TryGetValue(
                RequestContext.CorrelationIdHeader,
                out var correlationId
            )
        )
        {
            correlationId = Guid.NewGuid().ToString();
        }

        context.Items[RequestContext.CorrelationIdHeader] = correlationId;
        context.Response.Headers.TryAdd(RequestContext.CorrelationIdHeader, correlationId);

        await _next(context);
    }
}
