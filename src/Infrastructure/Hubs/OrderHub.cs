using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Infrastructure.Hubs;

[Authorize]
public class OrderHub : Hub
{
    private readonly ILogger<OrderHub> _logger;

    public OrderHub(ILogger<OrderHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId =
            Context.User?.FindFirst("sub")?.Value
            ?? Context
                .User?.FindFirst(
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                )
                ?.Value
            ?? Context.User?.Identity?.Name;

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            // If admin, add to admin group
            var isAdmin =
                Context.User?.IsInRole("Admin") == true
                || Context.User?.IsInRole("Administrator") == true;

            if (isAdmin)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
                _logger.LogInformation("Admin user {UserId} connected to OrderHub", userId);
            }
            else
            {
                _logger.LogInformation("User {UserId} connected to OrderHub", userId);
            }
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId =
            Context.User?.FindFirst("sub")?.Value
            ?? Context
                .User?.FindFirst(
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                )
                ?.Value
            ?? Context.User?.Identity?.Name;

        if (!string.IsNullOrEmpty(userId))
        {
            _logger.LogInformation(
                "User {UserId} disconnected from OrderHub. Exception: {Exception}",
                userId,
                exception?.Message ?? "None"
            );
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Client can request order status
    public async Task RequestOrderStatus(int orderId)
    {
        var userId =
            Context.User?.FindFirst("sub")?.Value
            ?? Context
                .User?.FindFirst(
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                )
                ?.Value
            ?? Context.User?.Identity?.Name;

        _logger.LogInformation(
            "Order status requested by user {UserId} for order {OrderId}",
            userId,
            orderId
        );

        // Signal that order status is needed - the client should fetch from API
        await Clients.Caller.SendAsync(
            "OrderStatusRequested",
            new { OrderId = orderId, Timestamp = DateTime.UtcNow }
        );
    }
}
