using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Queries.GetAllUsers;

public class GetAllUsersQueryHandler
    : IRequestHandler<GetAllUsersQuery, ServiceResult<PaginatedList<UserInfoResponse>>>
{
    private readonly IIdentityService _identityService;

    public GetAllUsersQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<PaginatedList<UserInfoResponse>>> Handle(
        GetAllUsersQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.GetAllUsersAsync(request.PageNumber, request.PageSize);
    }
}
