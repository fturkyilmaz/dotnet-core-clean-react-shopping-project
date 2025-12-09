using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

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

        await Clients.Caller.SendAsync(
            "OrderStatusRequested",
            new { OrderId = orderId, Timestamp = _clock.UtcNow }
        );
    }
}
