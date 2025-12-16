using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Identity.Commands.CreateRole;

[Authorize(Policy = Policies.RequireAdministratorRole)]
public record CreateRoleCommand(string RoleName) : IRequest<ServiceResult<string>>;
