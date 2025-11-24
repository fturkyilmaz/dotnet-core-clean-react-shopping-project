namespace ShoppingProject.Application.Common.Interfaces;

public interface IPushNotificationService
{
    Task SendPushNotificationAsync(string userId, string title, string body, object? data = null);
    Task SendPushNotificationToAllAsync(string title, string body, object? data = null);
    Task SendPushNotificationToRoleAsync(
        string role,
        string title,
        string body,
        object? data = null
    );
    Task RegisterPushTokenAsync(string userId, string token, string platform);
    Task UnregisterPushTokenAsync(string userId, string token);
}
