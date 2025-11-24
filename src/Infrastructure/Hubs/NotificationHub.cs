using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
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
            // Add user to their personal group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            // Add user to role groups
            var roles =
                Context
                    .User?.Claims.Where(c =>
                        c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    )
                    .Select(c => c.Value)
                    .ToList() ?? new List<string>();

            foreach (var role in roles)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, role.ToLower());
            }

            _logger.LogInformation(
                "User {UserId} connected to NotificationHub with roles: {Roles}",
                userId,
                string.Join(", ", roles)
            );
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
                "User {UserId} disconnected from NotificationHub. Exception: {Exception}",
                userId,
                exception?.Message ?? "None"
            );
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Client can call this to send a test notification
    public async Task SendTestNotification(string message)
    {
        var userId =
            Context.User?.FindFirst("sub")?.Value
            ?? Context
                .User?.FindFirst(
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                )
                ?.Value
            ?? Context.User?.Identity?.Name;

        await Clients.Caller.SendAsync(
            "ReceiveNotification",
            new
            {
                Type = "test",
                Message = message,
                UserId = userId,
                Timestamp = DateTime.UtcNow,
            }
        );

        _logger.LogInformation("Test notification sent to user {UserId}", userId);
    }

    // Register push notification token
    public async Task RegisterPushToken(string token, string platform)
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
            // Store token in database or cache
            _logger.LogInformation(
                "Push token registered for user {UserId}, platform: {Platform}",
                userId,
                platform
            );

            await Clients.Caller.SendAsync(
                "TokenRegistered",
                new { Success = true, Message = "Push token registered successfully" }
            );
        }
    }
}
