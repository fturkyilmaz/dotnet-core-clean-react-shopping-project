using System.Diagnostics;
using System.Text.Json;

namespace ShoppingProject.Web.Middlewares;

/// <summary>
/// Middleware for logging HTTP requests and responses with detailed metrics.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var traceId = Activity.Current?.Id ?? context.TraceIdentifier;

        // Log request
        var request = context.Request;
        _logger.LogInformation(
            "[Request] {Method} {Path} | TraceId: {TraceId} | IP: {ClientIP} | User-Agent: {UserAgent}",
            request.Method,
            request.Path,
            traceId,
            context.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            request.Headers["User-Agent"].FirstOrDefault() ?? "Unknown");

        // Capture response
        var originalResponseBody = context.Response.Body;
        using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;

        try
        {
            await _next(context);
            stopwatch.Stop();

            // Log response
            var statusCode = context.Response.StatusCode;
            var logLevel = statusCode >= 400 ? LogLevel.Warning : LogLevel.Information;

            _logger.Log(logLevel,
                "[Response] {Method} {Path} | Status: {StatusCode} | Duration: {DurationMs}ms | TraceId: {TraceId}",
                request.Method,
                request.Path,
                statusCode,
                stopwatch.ElapsedMilliseconds,
                traceId);

            // Copy response to original stream
            responseBodyStream.Seek(0, SeekOrigin.Begin);
            await responseBodyStream.CopyToAsync(originalResponseBody);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            _logger.LogError(ex,
                "[Error] {Method} {Path} | Duration: {DurationMs}ms | TraceId: {TraceId} | Error: {ErrorMessage}",
                request.Method,
                request.Path,
                stopwatch.ElapsedMilliseconds,
                traceId,
                ex.Message);

            throw;
        }
        finally
        {
            context.Response.Body = originalResponseBody;
        }
    }
}

/// <summary>
/// Extension methods for RequestLoggingMiddleware.
/// </summary>
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<RequestLoggingMiddleware>();
    }
}
