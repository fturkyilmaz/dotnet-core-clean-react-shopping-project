using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Exceptions;

namespace ShoppingProject.Application.Common.Behaviours;

public class UnhandledExceptionBehaviour<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<UnhandledExceptionBehaviour<TRequest, TResponse>> _logger;

    public UnhandledExceptionBehaviour(
        ILogger<UnhandledExceptionBehaviour<TRequest, TResponse>> logger
    )
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        try
        {
            return await next();
        }
        catch (Exception ex)
        {
            var requestName = typeof(TRequest).Name;

            _logger.LogError(
                ex,
                "Unhandled exception in {Behaviour} for request {RequestName} {@Request}",
                nameof(UnhandledExceptionBehaviour<TRequest, TResponse>),
                requestName,
                request
            );

            throw new UnhandledRequestException(requestName, request, ex);
        }
    }
}
