using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.ForgotPassword;

public class ForgotPasswordCommandHandler
    : IRequestHandler<ForgotPasswordCommand, ServiceResult<string>>
{
    private readonly IIdentityService _identityService;

    public ForgotPasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ServiceResult<string>> Handle(
        ForgotPasswordCommand request,
        CancellationToken cancellationToken
    )
    {
        return await _identityService.SendPasswordResetLinkAsync(request.Email);
    }
}
