using MediatR;

namespace ShoppingProject.Application.Common.Behaviours;

/// <summary>
/// Caching behavior for queries that implements cache-aside pattern
/// </summary>
public class CachingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<CachingBehaviour<TRequest, TResponse>> _logger;

    public CachingBehaviour(
        ICacheService cacheService,
        ILogger<CachingBehaviour<TRequest, TResponse>> logger
    )
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        // Check if request has Cacheable attribute
        var cacheableAttribute =
            typeof(TRequest).GetCustomAttributes(typeof(CacheableAttribute), true).FirstOrDefault()
            as CacheableAttribute;

        if (cacheableAttribute == null)
        {
            // No caching, proceed with next handler
            return await next();
        }

        var cacheKey = GenerateCacheKey(request, cacheableAttribute.KeyPrefix);

        _logger.LogInformation("Checking cache for key: {CacheKey}", cacheKey);

        // Try to get from cache
        var cachedResponse = await _cacheService.GetAsync<TResponse>(cacheKey, cancellationToken);

        if (cachedResponse != null)
        {
            _logger.LogInformation("Cache hit for key: {CacheKey}", cacheKey);
            return cachedResponse;
        }

        _logger.LogInformation("Cache miss for key: {CacheKey}", cacheKey);

        // Execute the handler
        var response = await next();

        // Cache the response
        await _cacheService.SetAsync(
            cacheKey,
            response,
            TimeSpan.FromMinutes(cacheableAttribute.DurationMinutes),
            cancellationToken
        );

        _logger.LogInformation("Cached response for key: {CacheKey}", cacheKey);

        return response;
    }

    private string GenerateCacheKey(TRequest request, string prefix)
    {
        var requestType = typeof(TRequest).Name;
        var requestJson = System.Text.Json.JsonSerializer.Serialize(request);
        var hash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(requestJson)
            )
        );

        return $"{prefix}:{requestType}:{hash}";
    }
}

/// <summary>
/// Attribute to mark queries as cacheable
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class CacheableAttribute : Attribute
{
    public string KeyPrefix { get; }
    public int DurationMinutes { get; }

    public CacheableAttribute(string keyPrefix = "query", int durationMinutes = 30)
    {
        KeyPrefix = keyPrefix;
        DurationMinutes = durationMinutes;
    }
}
