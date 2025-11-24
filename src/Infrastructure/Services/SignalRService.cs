using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Hubs;

namespace ShoppingProject.Infrastructure.Services;

public class SignalRService : ISignalRService
{
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly IHubContext<CartHub> _cartHub;
    private readonly IHubContext<OrderHub> _orderHub;
    private readonly ILogger<SignalRService> _logger;

    public SignalRService(
        IHubContext<NotificationHub> notificationHub,
        IHubContext<CartHub> cartHub,
        IHubContext<OrderHub> orderHub,
        ILogger<SignalRService> logger
    )
    {
        _notificationHub = notificationHub;
        _cartHub = cartHub;
        _orderHub = orderHub;
        _logger = logger;
    }

    // Notifications
    public async Task SendNotificationToUserAsync(string userId, object notification)
    {
        try
        {
            await _notificationHub
                .Clients.Group($"user_{userId}")
                .SendAsync("ReceiveNotification", notification);

            _logger.LogInformation("Sent notification to user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to user {UserId}", userId);
        }
    }

    public async Task SendNotificationToAllAsync(object notification)
    {
        try
        {
            await _notificationHub.Clients.All.SendAsync("ReceiveNotification", notification);

            _logger.LogInformation("Sent notification to all users");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to all users");
        }
    }

    public async Task SendNotificationToRoleAsync(string role, object notification)
    {
        try
        {
            await _notificationHub
                .Clients.Group(role.ToLower())
                .SendAsync("ReceiveNotification", notification);

            _logger.LogInformation("Sent notification to role {Role}", role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending notification to role {Role}", role);
        }
    }

    // Cart
    public async Task NotifyCartUpdatedAsync(string userId, object cartData)
    {
        try
        {
            await _cartHub.Clients.Group($"cart_{userId}").SendAsync("CartUpdated", cartData);

            _logger.LogInformation("Notified cart update for user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying cart update for user {UserId}", userId);
        }
    }

    public async Task NotifyItemAddedAsync(string userId, object item)
    {
        try
        {
            await _cartHub.Clients.Group($"cart_{userId}").SendAsync("ItemAdded", item);

            _logger.LogInformation("Notified item added for user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying item added for user {UserId}", userId);
        }
    }

    public async Task NotifyItemRemovedAsync(string userId, int itemId)
    {
        try
        {
            await _cartHub.Clients.Group($"cart_{userId}").SendAsync("ItemRemoved", itemId);

            _logger.LogInformation("Notified item removed for user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying item removed for user {UserId}", userId);
        }
    }

    public async Task NotifyCartClearedAsync(string userId)
    {
        try
        {
            await _cartHub.Clients.Group($"cart_{userId}").SendAsync("CartCleared");

            _logger.LogInformation("Notified cart cleared for user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying cart cleared for user {UserId}", userId);
        }
    }

    // Orders
    public async Task NotifyOrderCreatedAsync(string userId, int orderId)
    {
        try
        {
            await _orderHub
                .Clients.Group($"user_{userId}")
                .SendAsync("OrderCreated", new { OrderId = orderId, Timestamp = DateTime.UtcNow });

            _logger.LogInformation(
                "Notified order created for user {UserId}, order {OrderId}",
                userId,
                orderId
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying order created for user {UserId}", userId);
        }
    }

    public async Task NotifyOrderStatusChangedAsync(string userId, int orderId, string status)
    {
        try
        {
            await _orderHub
                .Clients.Group($"user_{userId}")
                .SendAsync(
                    "OrderStatusChanged",
                    new
                    {
                        OrderId = orderId,
                        Status = status,
                        Timestamp = DateTime.UtcNow,
                    }
                );

            _logger.LogInformation(
                "Notified order status changed for user {UserId}, order {OrderId}, status {Status}",
                userId,
                orderId,
                status
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying order status changed for user {UserId}", userId);
        }
    }

    public async Task NotifyAdminsNewOrderAsync(int orderId)
    {
        try
        {
            await _orderHub
                .Clients.Group("admins")
                .SendAsync("NewOrder", new { OrderId = orderId, Timestamp = DateTime.UtcNow });

            _logger.LogInformation("Notified admins of new order {OrderId}", orderId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying admins of new order {OrderId}", orderId);
        }
    }
}
