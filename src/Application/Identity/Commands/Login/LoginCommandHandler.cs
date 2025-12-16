using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;

namespace ShoppingProject.Application.Identity.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, ServiceResult<AuthResponse>>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<AuthResponse>> Handle(
        LoginCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.LoginAsync(request.Email, request.Password);
    }
}
