using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.AssignAdminRole;

public class AssignAdminRoleCommandHandler
    : IRequestHandler<AssignAdminRoleCommand, ServiceResult<string>>
{
    private readonly IIdentityService _identityService;

    public AssignAdminRoleCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<string>> Handle(
        AssignAdminRoleCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.AssignUserToRoleAsync(request.UserId, request.RoleName);
    }
}
