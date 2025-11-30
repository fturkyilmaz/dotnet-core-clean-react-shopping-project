using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly JsonSerializerOptions _jsonOptions;

    public RedisCacheService(IDistributedCache cache)
    {
        _cache = cache;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = false,
        };
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var data = await _cache.GetStringAsync(key, cancellationToken);

        if (string.IsNullOrEmpty(data))
            return default;

        return JsonSerializer.Deserialize<T>(data, _jsonOptions);
    }

    public async Task SetAsync<T>(
        string key,
        T value,
        TimeSpan? expiry = null,
        CancellationToken cancellationToken = default
    )
    {
        var options = new DistributedCacheEntryOptions();

        if (expiry.HasValue)
            options.SetAbsoluteExpiration(expiry.Value);
        else
            options.SetAbsoluteExpiration(TimeSpan.FromMinutes(30)); // Default 30 minutes

        var serializedData = JsonSerializer.Serialize(value, _jsonOptions);
        await _cache.SetStringAsync(key, serializedData, options, cancellationToken);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _cache.RemoveAsync(key, cancellationToken);
    }

    public async Task<T> GetOrCreateAsync<T>(
        string key,
        Func<Task<T>> factory,
        TimeSpan? expiry = null,
        CancellationToken cancellationToken = default
    )
    {
        var cachedValue = await GetAsync<T>(key, cancellationToken);

        if (cachedValue != null)
            return cachedValue;

        var value = await factory();
        await SetAsync(key, value, expiry, cancellationToken);

        return value;
    }

    public async Task<T> GetOrSetAsync<T>(
        string key,
        Func<Task<T>> factory,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default
    )
    {
        var cachedValue = await GetAsync<T>(key, cancellationToken);

        if (cachedValue is not null)
        {
            return cachedValue;
        }

        var value = await factory();

        if (value is not null)
        {
            await SetAsync(key, value, expiration, cancellationToken);
        }

        return value;
    }
}
