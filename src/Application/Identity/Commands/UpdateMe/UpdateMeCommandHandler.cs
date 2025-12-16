using MediatR;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.UpdateMe;

public sealed class UpdateMeCommandHandler
    : IRequestHandler<UpdateMeCommand, ServiceResult<UserInfoResponse>>
{
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    public UpdateMeCommandHandler(IUser user, IIdentityService identityService)
    {
        _user = user;
        _identityService = identityService;
    }

    public async Task<ServiceResult<UserInfoResponse>> Handle(
        UpdateMeCommand request,
        CancellationToken cancellationToken)
    {
         if (string.IsNullOrWhiteSpace(_user.Id))
        {
            return ServiceResult<UserInfoResponse>.Fail("Unauthorized");
        }

        return await _identityService.UpdateUserAsync(
            _user.Id,
            request.FirstName,
            request.LastName,
            request.Gender
        );
    }
}
