using System.Reflection;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;

namespace ShoppingProject.Application.Common.Behaviours;

public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    public AuthorizationBehaviour(IUser user, IIdentityService identityService)
    {
        _user = user;
        _identityService = identityService;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        var authorizeAttributes = request
            .GetType()
            .GetCustomAttributes<AuthorizeAttribute>(true)
            .ToArray();

        // No authorization required
        if (!authorizeAttributes.Any())
            return await next();

        // Must be authenticated
        if (string.IsNullOrWhiteSpace(_user.Id))
            throw new UnauthorizedAccessException();

        var userRoles = _user.GetRoles();

        // Role-based authorization
        var roleAttributes = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Roles));

        if (roleAttributes.Any())
        {
            var isAuthorized = roleAttributes.Any(attr =>
                attr.Roles!.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(r => r.Trim())
                    .Any(role => userRoles.Contains(role))
            );

            if (!isAuthorized)
                throw new ForbiddenAccessException();
        }

        // Policy-based authorization
        var policyAttributes = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Policy));

        foreach (var policy in policyAttributes.Select(a => a.Policy!))
        {
            var authorized = await _identityService.AuthorizeAsync(_user.Id!, policy);

            if (!authorized)
                throw new ForbiddenAccessException();
        }

        return await next();
    }
}
