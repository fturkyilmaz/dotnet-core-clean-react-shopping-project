using System.Reflection;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Application.Common.Behaviours;

/// <summary>
/// Enhanced caching behavior with cache invalidation support and detailed logging.
/// </summary>
public class CachingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : class
{
    private readonly Application.Common.Interfaces.ICacheService _cacheService;
    private readonly ILogger<CachingBehaviour<TRequest, TResponse>> _logger;

    public CachingBehaviour(
        Application.Common.Interfaces.ICacheService cacheService,
        ILogger<CachingBehaviour<TRequest, TResponse>> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var cacheAttribute = request.GetType().GetCustomAttribute<CacheableAttribute>();

        if (cacheAttribute == null)
        {
            _logger.LogDebug("No cache attribute found for {RequestType}, skipping cache",
                typeof(TRequest).Name);
            return await next();
        }

        var cacheKey = GenerateCacheKey(request);
        var cachedResponse = await _cacheService.GetAsync<TResponse>(cacheKey, cancellationToken);

        if (cachedResponse is not null)
        {
            _logger.LogInformation(
                "Cache HIT for {RequestType} - Key: {CacheKey}, Duration: {Duration}m",
                typeof(TRequest).Name,
                cacheKey,
                cacheAttribute.DurationMinutes);
            return cachedResponse;
        }

        _logger.LogDebug(
            "Cache MISS for {RequestType} - Key: {CacheKey}",
            typeof(TRequest).Name,
            cacheKey);

        var response = await next();

        await _cacheService.SetAsync(
            cacheKey,
            response,
            TimeSpan.FromMinutes(cacheAttribute.DurationMinutes),
            cancellationToken);

        _logger.LogInformation(
            "Cache SET for {RequestType} - Key: {CacheKey}, Duration: {Duration}m",
            typeof(TRequest).Name,
            cacheKey,
            cacheAttribute.DurationMinutes);

        return response;
    }

    private static string GenerateCacheKey(TRequest request)
    {
        var requestType = request.GetType().Name;
        var requestJson = JsonSerializer.Serialize(request);
        var hash = Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(requestJson)));
        return $"{requestType}:{hash}";
    }
}

/// <summary>
/// Attribute to mark a query as cacheable.
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class CacheableAttribute : Attribute
{
    public string KeyPrefix { get; }
    public int DurationMinutes { get; }
    public string[] Tags { get; }

    public CacheableAttribute(string keyPrefix, int durationMinutes = 10, params string[] tags)
    {
        KeyPrefix = keyPrefix;
        DurationMinutes = durationMinutes;
        Tags = tags;
    }
}

/// <summary>
/// Attribute to mark a command as cache invalidator.
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class CacheInvalidatorAttribute : Attribute
{
    public string[] Tags { get; }

    public CacheInvalidatorAttribute(params string[] tags)
    {
        Tags = tags;
    }
}
