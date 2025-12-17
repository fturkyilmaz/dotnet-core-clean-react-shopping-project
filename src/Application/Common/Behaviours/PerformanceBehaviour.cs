using System.Diagnostics;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Application.Common.Behaviours;

public class PerformanceBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly Stopwatch _timer;
    private readonly ILogger<PerformanceBehaviour<TRequest, TResponse>> _logger;
    private readonly IUser _user;
    private readonly IIdentityService _identityService;


    public PerformanceBehaviour(
        ILogger<PerformanceBehaviour<TRequest, TResponse>> logger,
        IUser user,
        IIdentityService identityService
    )
    {
        _timer = new Stopwatch();
        _logger = logger;
        _user = user;
        _identityService = identityService;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        _timer.Start();

        var response = await next();

        _timer.Stop();

        var elapsedMilliseconds = _timer.ElapsedMilliseconds;

        if (elapsedMilliseconds > 500)
        {
            var requestName = typeof(TRequest).Name;
            var userId = _user.Id ?? string.Empty;
            var userName = string.Empty;

            if (!string.IsNullOrEmpty(userId))
            {
                userName = await _identityService.GetUserNameAsync(userId);
            }

            _logger.LogWarning(
                "Long Running Request: {RequestName} took {ElapsedMilliseconds} ms. UserId={UserId}, UserName={UserName}, Request={@Request}",
                requestName,
                elapsedMilliseconds,
                userId,
                userName,
                request
            );
        }

        return response;
    }
}
