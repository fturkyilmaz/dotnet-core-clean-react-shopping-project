using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Services;

public class PushNotificationService : IPushNotificationService
{
    private readonly ILogger<PushNotificationService> _logger;
    private readonly ICacheService _cacheService;
    private readonly HttpClient _httpClient;

    public PushNotificationService(
        ILogger<PushNotificationService> logger,
        ICacheService cacheService,
        IHttpClientFactory httpClientFactory
    )
    {
        _logger = logger;
        _cacheService = cacheService;
        _httpClient = httpClientFactory.CreateClient("ExpoNotifications");
    }

    public async Task SendPushNotificationAsync(
        string userId,
        string title,
        string body,
        object? data = null
    )
    {
        try
        {
            // Get user's push tokens from cache/database
            var tokens = await GetUserPushTokensAsync(userId);

            if (!tokens.Any())
            {
                _logger.LogWarning("No push tokens found for user {UserId}", userId);
                return;
            }

            foreach (var token in tokens)
            {
                await SendExpoNotificationAsync(token, title, body, data);
            }

            _logger.LogInformation("Sent push notification to user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification to user {UserId}", userId);
        }
    }

    public async Task SendPushNotificationToAllAsync(string title, string body, object? data = null)
    {
        try
        {
            // Get all push tokens from cache/database
            var allTokens = await GetAllPushTokensAsync();

            foreach (var token in allTokens)
            {
                await SendExpoNotificationAsync(token, title, body, data);
            }

            _logger.LogInformation("Sent push notification to all users");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification to all users");
        }
    }

    public async Task SendPushNotificationToRoleAsync(
        string role,
        string title,
        string body,
        object? data = null
    )
    {
        try
        {
            // Get push tokens for users in role from cache/database
            var tokens = await GetRolePushTokensAsync(role);

            foreach (var token in tokens)
            {
                await SendExpoNotificationAsync(token, title, body, data);
            }

            _logger.LogInformation("Sent push notification to role {Role}", role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification to role {Role}", role);
        }
    }

    public async Task RegisterPushTokenAsync(string userId, string token, string platform)
    {
        try
        {
            // Store token in cache with user ID
            var cacheKey = $"push_tokens_{userId}";
            var tokens = await _cacheService.GetOrSetAsync(
                cacheKey,
                async () => new List<string>(),
                TimeSpan.FromDays(30),
                CancellationToken.None
            );

            if (!tokens.Contains(token))
            {
                tokens.Add(token);
                await _cacheService.SetAsync(
                    cacheKey,
                    tokens,
                    TimeSpan.FromDays(30),
                    CancellationToken.None
                );
            }

            _logger.LogInformation(
                "Registered push token for user {UserId}, platform: {Platform}",
                userId,
                platform
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering push token for user {UserId}", userId);
        }
    }

    public async Task UnregisterPushTokenAsync(string userId, string token)
    {
        try
        {
            var cacheKey = $"push_tokens_{userId}";
            var tokens = await _cacheService.GetAsync<List<string>>(
                cacheKey,
                CancellationToken.None
            );

            if (tokens != null && tokens.Contains(token))
            {
                tokens.Remove(token);
                await _cacheService.SetAsync(
                    cacheKey,
                    tokens,
                    TimeSpan.FromDays(30),
                    CancellationToken.None
                );
            }

            _logger.LogInformation("Unregistered push token for user {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unregistering push token for user {UserId}", userId);
        }
    }

    private async Task<List<string>> GetUserPushTokensAsync(string userId)
    {
        var cacheKey = $"push_tokens_{userId}";
        return await _cacheService.GetAsync<List<string>>(cacheKey, CancellationToken.None)
            ?? new List<string>();
    }

    private async Task<List<string>> GetAllPushTokensAsync()
    {
        // In production, this should query database
        // For now, return empty list
        return await Task.FromResult(new List<string>());
    }

    private async Task<List<string>> GetRolePushTokensAsync(string role)
    {
        // In production, this should query database for users in role
        // For now, return empty list
        return await Task.FromResult(new List<string>());
    }

    private async Task SendExpoNotificationAsync(
        string pushToken,
        string title,
        string body,
        object? data
    )
    {
        try
        {
            var message = new
            {
                to = pushToken,
                sound = "default",
                title = title,
                body = body,
                data = data ?? new { },
            };

            var response = await _httpClient.PostAsJsonAsync(
                "https://exp.host/--/api/v2/push/send",
                message
            );

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Failed to send Expo notification. Status: {StatusCode}",
                    response.StatusCode
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Expo notification to token {Token}", pushToken);
        }
    }
}
