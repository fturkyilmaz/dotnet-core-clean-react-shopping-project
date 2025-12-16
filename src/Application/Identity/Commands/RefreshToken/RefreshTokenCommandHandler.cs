using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;

namespace ShoppingProject.Application.Identity.Commands.RefreshToken;

public class RefreshTokenCommandHandler
    : IRequestHandler<RefreshTokenCommand, ServiceResult<AuthResponse>>
{
    private readonly IIdentityService _identityService;

    public RefreshTokenCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<AuthResponse>> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);
    }
}
