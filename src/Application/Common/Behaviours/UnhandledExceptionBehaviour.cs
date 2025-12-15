using MediatR;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Exceptions;

namespace ShoppingProject.Application.Common.Behaviours
{
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
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Entity not found in {RequestName}", typeof(TRequest).Name);
                throw new NotFoundException($"Entity not found in {typeof(TRequest).Name}", ex);
            }
            catch (BusinessRuleException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Business rule violated in {RequestName}",
                    typeof(TRequest).Name
                );
                throw new BusinessRuleException(
                    $"Business rule violated in {typeof(TRequest).Name}",
                    ex
                );
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
}
