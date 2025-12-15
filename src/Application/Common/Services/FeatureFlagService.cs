using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Services;

public class FeatureFlagService : IFeatureFlagService
{
    private readonly IFeatureFlagRepository _repository;
    private readonly IMemoryCache _cache;
    private readonly IUser _currentUser;
    private readonly ILogger<FeatureFlagService> _logger;
    private readonly IClock _clock;
    private const string CacheKeyPrefix = "feature_flag_";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

    public FeatureFlagService(
        IFeatureFlagRepository repository,
        IMemoryCache cache,
        IUser currentUser,
        ILogger<FeatureFlagService> logger,
        IClock clock
    )
    {
        _repository = repository;
        _cache = cache;
        _currentUser = currentUser;
        _logger = logger;
        _clock = clock;
    }

    public async Task<bool> IsEnabledAsync(
        string featureName,
        string? userId = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var cacheKey = $"{CacheKeyPrefix}{featureName}";

            var featureFlag = await _cache.GetOrCreateAsync(
                cacheKey,
                async entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                    return await _repository.GetByNameAsync(featureName, cancellationToken);
                }
            );

            if (featureFlag == null)
            {
                _logger.LogWarning(
                    "Feature flag {FeatureName} not found, defaulting to false",
                    featureName
                );
                return false;
            }

            var targetUserId = userId ?? _currentUser.Id ?? "anonymous";
            var userRoles = _currentUser.GetRoles();
            return featureFlag.IsEnabledForUser(targetUserId, userRoles.ToList(), _clock.UtcNow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking feature flag {FeatureName}", featureName);
            throw new ApplicationBaseException($"Error checking feature flag {featureName}", ex);
        }
    }

    public async Task<T> GetVariantAsync<T>(
        string featureName,
        T defaultValue,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var cacheKey = $"{CacheKeyPrefix}{featureName}";

            var featureFlag = await _cache.GetOrCreateAsync(
                cacheKey,
                async entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                    return await _repository.GetByNameAsync(featureName, cancellationToken);
                }
            );

            if (featureFlag == null || !featureFlag.IsActive(_clock.UtcNow))
                return defaultValue;

            if (featureFlag.Metadata.TryGetValue("variant", out var variantJson))
            {
                return System.Text.Json.JsonSerializer.Deserialize<T>(variantJson) ?? defaultValue;
            }

            return defaultValue;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting feature variant {FeatureName}", featureName);
            throw new ApplicationBaseException($"Error getting feature variant {featureName}", ex);
        }
    }
}
