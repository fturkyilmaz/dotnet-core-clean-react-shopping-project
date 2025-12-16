using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;

namespace ShoppingProject.Application.Identity.Queries.GetCurrentUserInfo;

public class GetCurrentUserInfoQueryHandler
    : IRequestHandler<GetCurrentUserInfoQuery, ServiceResult<UserInfoResponse>>
{
    private readonly IIdentityService _identityService;

    public GetCurrentUserInfoQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<UserInfoResponse>> Handle(
        GetCurrentUserInfoQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.GetUserInfoAsync(request.UserId);
    }
}
