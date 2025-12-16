using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, ServiceResult<string>>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<string>> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.RegisterAsync(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.Gender ?? "Unknown",
            request.Role
        );
    }
}
