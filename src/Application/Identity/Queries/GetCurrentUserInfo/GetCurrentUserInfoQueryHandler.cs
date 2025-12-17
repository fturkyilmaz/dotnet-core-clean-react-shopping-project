using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;

namespace ShoppingProject.Application.Identity.Queries.GetCurrentUserInfo;

public class GetCurrentUserInfoQueryHandler
    : IRequestHandler<GetCurrentUserInfoQuery, ServiceResult<UserInfoResponse>>
{
    private readonly IIdentityService _identityService;
    private readonly IUser _currentUser;

    public GetCurrentUserInfoQueryHandler(IIdentityService identityService , IUser currentUser)
    {
        _identityService = identityService;
        _currentUser = currentUser;
    }

    public async Task<ServiceResult<UserInfoResponse>> Handle(
        GetCurrentUserInfoQuery request,
        CancellationToken cancellationToken
    )
    {
        var userId = _currentUser.Id ?? string.Empty;
        if (string.IsNullOrWhiteSpace(userId)) return ServiceResult<UserInfoResponse>.Fail("Unauthorized");

        return await _identityService.GetUserInfoAsync(userId);
    }
}
