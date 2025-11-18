using System.Text.Json;
using StackExchange.Redis;

namespace ShoppingProject.Service;

public class RedisCacheService
{
    private readonly IDatabase _db;

    public RedisCacheService(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        // Use JsonSerializer.Serialize(value) to get the JSON string.
        var json = JsonSerializer.Serialize(value);
        await _db.StringSetAsync(key, json, expiry);
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var value = await _db.StringGetAsync(key);

        // 1. Check if the key exists or the value is empty/null in Redis.
        if (value.IsNullOrEmpty) 
        {
            return default;
        }

        try
        {
            // 2. Deserialize the JSON string. Passing 'null' for options is fine, 
            // but we ensure error handling.
            return JsonSerializer.Deserialize<T>(value.ToString());
        }
        catch (JsonException)
        {
            // Handle cases where deserialization fails (e.g., corrupted cache value).
            // You might log this error here.
            return default;
        }
    }

    public async Task RemoveAsync(string key)
    {
        await _db.KeyDeleteAsync(key);
    }
}