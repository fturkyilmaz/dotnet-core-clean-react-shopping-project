using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Queries.GetAllUsers;

public class GetAllUsersQueryHandler
    : IRequestHandler<GetAllUsersQuery, ServiceResult<List<UserInfoResponse>>>
{
    private readonly IIdentityService _identityService;

    public GetAllUsersQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<List<UserInfoResponse>>> Handle(
        GetAllUsersQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.GetAllUsersAsync();
    }
}
