using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.CreateRole;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, ServiceResult<string>>
{
    private readonly IIdentityService _identityService;

    public CreateRoleCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<string>> Handle(
        CreateRoleCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.CreateRoleAsync(request.RoleName);
    }
}
