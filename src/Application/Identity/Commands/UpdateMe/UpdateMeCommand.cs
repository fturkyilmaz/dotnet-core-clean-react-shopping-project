using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.UpdateMe;

public record UpdateMeCommand(
    string UserId,
    string FirstName,
    string LastName,
    string Gender
) : IRequest<ServiceResult<UserInfoResponse>>;
