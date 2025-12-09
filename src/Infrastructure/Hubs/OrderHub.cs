using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;
using System.Security.Claims;

namespace ShoppingProject.Infrastructure.Hubs;

[Authorize]
public class OrderHub : Hub
{
    private readonly ILogger<OrderHub> _logger;
    private readonly IClock _clock;

    public OrderHub(ILogger<OrderHub> logger, IClock clock)
    {
        _logger = logger;
        _clock = clock;
    }

    private string? GetUserId()
    {
        return Context.User?.FindFirst("sub")?.Value
            ?? Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.Identity?.Name;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            var isAdmin =
                Context.User?.IsInRole("Admin") == true
                || Context.User?.IsInRole("Administrator") == true;

            if (isAdmin)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "role_admins");
                _logger.LogInformation(
                    "Admin user {UserId} connected to OrderHub with ConnectionId {ConnectionId}",
                    userId,
                    Context.ConnectionId
                );
            }
            else
            {
                _logger.LogInformation(
                    "User {UserId} connected to OrderHub with ConnectionId {ConnectionId}",
                    userId,
                    Context.ConnectionId
                );
            }
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();

        if (!string.IsNullOrEmpty(userId))
        {
            _logger.LogInformation(
                "User {UserId} disconnected from OrderHub with ConnectionId {ConnectionId}. Exception: {Exception}",
                userId,
                Context.ConnectionId,
                exception?.Message ?? "None"
            );
        }

        await base.OnDisconnectedAsync(exception);
    }

    [Authorize(Roles = "Client,Admin")]
    public async Task RequestOrderStatus(int orderId)
    {
        var userId = GetUserId();

        try
        {
            _logger.LogInformation(
                "Order status requested by user {UserId} for order {OrderId} with ConnectionId {ConnectionId}, CorrelationId {CorrelationId}",
                userId,
                orderId,
                Context.ConnectionId,
                Context.GetHttpContext()?.TraceIdentifier
            );

            await Clients.Caller.SendAsync(
                "OrderStatusRequested",
                new { OrderId = orderId, Timestamp = _clock.UtcNow }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending order status to user {UserId}", userId);
            await Clients.Caller.SendAsync("OrderStatusRequestedError", new { Success = false, Message = ex.Message });
        }
    }
}
