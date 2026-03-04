using System.Reflection;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ShoppingProject.Application.Common.Behaviours;

/// <summary>
/// Pipeline behavior that invalidates cache entries when commands are executed.
/// </summary>
public class CacheInvalidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<CacheInvalidationBehaviour<TRequest, TResponse>> _logger;

    public CacheInvalidationBehaviour(
        ICacheService cacheService,
        ILogger<CacheInvalidationBehaviour<TRequest, TResponse>> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var response = await next();

        var cacheInvalidator = request.GetType().GetCustomAttribute<CacheInvalidatorAttribute>();
        if (cacheInvalidator != null)
        {
            foreach (var tag in cacheInvalidator.Tags)
            {
                _logger.LogInformation(
                    "Cache INVALIDATED for {RequestType} - Tag: {Tag}",
                    typeof(TRequest).Name,
                    tag);
                await _cacheService.RemoveByTagAsync(tag, cancellationToken);
            }
        }

        return response;
    }
}
