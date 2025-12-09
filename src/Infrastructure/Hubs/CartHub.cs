using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Hubs;

[Authorize]
public class CartHub : Hub
{
    private readonly ILogger<CartHub> _logger;
    private readonly IClock _clock;

    public CartHub(ILogger<CartHub> logger, IClock clock)
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
            // Join user's cart group for multi-device sync
            await Groups.AddToGroupAsync(Context.ConnectionId, $"cart_{userId}");
            _logger.LogInformation("User {UserId} connected to CartHub", userId);
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
                "User {UserId} disconnected from CartHub. Exception: {Exception}",
                userId,
                exception?.Message ?? "None"
            );
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Client can request current cart state
    public async Task RequestCartSync()
    {
        var userId =
            Context.User?.FindFirst("sub")?.Value
            ?? Context
                .User?.FindFirst(
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                )
                ?.Value
            ?? Context.User?.Identity?.Name;

        _logger.LogInformation("Cart sync requested by user {UserId}", userId);

        // Signal that cart sync is needed - the client should fetch from API
        await Clients.Caller.SendAsync(
            "CartSyncRequested",
            new { UserId = userId, Timestamp = _clock.UtcNow }
        );
    }
}
