using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Queries.GetCurrentUserInfo;

// Handler: Query'yi alır ve veriyi hazırlar.
public class GetCurrentUserInfoQueryHandler
    : IRequestHandler<GetCurrentUserInfoQuery, UserInfoResponse>
{
    private readonly IIdentityService _identityService;

    public GetCurrentUserInfoQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserInfoResponse> Handle(
        GetCurrentUserInfoQuery request,
        CancellationToken cancellationToken
    )
    {
        var userResult = await _identityService.GetUserByIdAsync(request.UserId);

        if (!userResult.Result.Succeeded || userResult.Response == null)
        {
            throw new KeyNotFoundException($"User with ID {request.UserId} not found.");
        }

        var user = userResult.Response;
        var roles = await _identityService.GetRolesAsync(request.UserId);

        var response = new UserInfoResponse(
            user.Id,
            user.Email,
            user.FirstName ?? string.Empty,
            user.LastName ?? string.Empty,
            user.UserName ?? string.Empty,
            user.Gender ?? string.Empty,
            roles.ToList().AsReadOnly()
        );

        return response;
    }
}
