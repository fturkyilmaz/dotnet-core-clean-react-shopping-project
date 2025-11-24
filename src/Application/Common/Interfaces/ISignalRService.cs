namespace ShoppingProject.Application.Common.Interfaces;

public interface ISignalRService
{
    // Notifications
    Task SendNotificationToUserAsync(string userId, object notification);
    Task SendNotificationToAllAsync(object notification);
    Task SendNotificationToRoleAsync(string role, object notification);

    // Cart
    Task NotifyCartUpdatedAsync(string userId, object cartData);
    Task NotifyItemAddedAsync(string userId, object item);
    Task NotifyItemRemovedAsync(string userId, int itemId);
    Task NotifyCartClearedAsync(string userId);

    // Orders
    Task NotifyOrderCreatedAsync(string userId, int orderId);
    Task NotifyOrderStatusChangedAsync(string userId, int orderId, string status);
    Task NotifyAdminsNewOrderAsync(int orderId);
}
