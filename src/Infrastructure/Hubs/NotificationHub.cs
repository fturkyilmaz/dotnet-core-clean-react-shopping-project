using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;
using System.Security.Claims;

namespace ShoppingProject.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;
    private readonly IClock _clock;
    private readonly IPushTokenRepository _pushTokenRepository;

    // ✅ Constructor injection ile hem logger hem clock alınıyor
    public NotificationHub(ILogger<NotificationHub> logger, IClock clock, IPushTokenRepository pushTokenRepository)
    {
        _logger = logger;
        _clock = clock;
        _pushTokenRepository = pushTokenRepository;
    }

    private string? GetUserId()
    {
        return Context.User?.FindFirst("sub")?.Value
            ?? Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.Identity?.Name;
    }

    private List<string> GetUserRoles()
    {
        return Context.User?.Claims
            .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList() ?? new List<string>();
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        if (!string.IsNullOrEmpty(userId))
        {
            // Add user to their personal group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            // Add user to role groups
            var roles = GetUserRoles();

            foreach (var role in roles)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"role_{role.ToLower()}");
            }

            _logger.LogInformation(
                "User {UserId} connected to NotificationHub with ConnectionId {ConnectionId}, Roles: {Roles}",
                userId,
                Context.ConnectionId,
                string.Join(", ", roles)
            );
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();

        if (!string.IsNullOrEmpty(userId))
        {
            _logger.LogInformation(
                "User {UserId} disconnected from NotificationHub with ConnectionId {ConnectionId}. Exception: {Exception}",
                userId,
                Context.ConnectionId,
                exception?.Message ?? "None"
            );
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Client can call this to send a test notification
    [Authorize(Roles = "Administrator")]
    public async Task SendTestNotification(string message)
    {
        var userId = GetUserId();

        try
        {
            await Clients.Caller.SendAsync(
                "ReceiveNotification",
                new
                {
                    Type = "test",
                    Message = message,
                    UserId = userId,
                    Timestamp = _clock.UtcNow,
                }
            );

            _logger.LogInformation(
                "Test notification sent to user {UserId} with ConnectionId {ConnectionId}, CorrelationId {CorrelationId}",
                userId,
                Context.ConnectionId,
                Context.GetHttpContext()?.TraceIdentifier
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test notification to user {UserId}", userId);
            await Clients.Caller.SendAsync("ReceiveNotificationError", new { Success = false, Message = ex.Message });
        }
    }

    // Register push notification token
    public async Task RegisterPushToken(string token, string platform)
    {
        var userId = GetUserId();

        if (!string.IsNullOrEmpty(userId))
        {
            try
            {
                await _pushTokenRepository.SaveAsync(userId, token, platform);
                _logger.LogInformation(
                    "Push token registered for user {UserId}, platform: {Platform}, ConnectionId: {ConnectionId}, CorrelationId: {CorrelationId}",
                    userId,
                    platform,
                    Context.ConnectionId,
                    Context.GetHttpContext()?.TraceIdentifier
                );

                await Clients.Caller.SendAsync(
                    "TokenRegistered",
                    new { Success = true, Message = "Push token registered successfully" }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering push token for {UserId}", userId);
                await Clients.Caller.SendAsync("TokenRegistered", new { Success = false, Message = ex.Message });
            }
        }
    }
}
