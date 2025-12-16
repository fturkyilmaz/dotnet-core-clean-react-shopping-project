using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Identity.Commands.AssignAdminRole;

[Authorize(Policy = Policies.RequireAdministratorRole)]
public record AssignAdminRoleCommand(string UserId, string RoleName = "Administrator") : IRequest<ServiceResult<string>>;
