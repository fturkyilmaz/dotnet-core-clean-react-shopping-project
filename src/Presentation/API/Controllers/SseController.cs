using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace ShoppingProject.WebApi.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/sse")]
[ApiVersion("1.0")]
public class SseController : ControllerBase
{
    [HttpGet("events")]
    public async Task GetEvents(CancellationToken cancellationToken)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");

        while (!cancellationToken.IsCancellationRequested)
        {
            var message = $"Event at {DateTime.UtcNow}";
            await Response.WriteAsync($"data: {message}\n\n", cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
            await Task.Delay(1000, cancellationToken);
        }
    }
}
