using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.ResetPassword;

public class ResetPasswordCommandHandler
    : IRequestHandler<ResetPasswordCommand, ServiceResult<string>>
{
    private readonly IIdentityService _identityService;

    public ResetPasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<string>> Handle(
        ResetPasswordCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.ResetPasswordAsync(
            request.Email,
            request.Token,
            request.NewPassword
        );
    }
}
