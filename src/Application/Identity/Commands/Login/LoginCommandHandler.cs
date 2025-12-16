using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResponse> Handle(
        LoginCommand request,
        CancellationToken cancellationToken
    )
    {
        var (result, response) = await _identityService.LoginAsync(request.Email, request.Password);

        if (!result.Succeeded || response == null)
        {
            throw new Exception($"Authentication Failed: {string.Join(", ", result.Errors)}");
        }

        return response;
    }
}
