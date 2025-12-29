using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.Identity.Commands.AssignAdminRole;
using ShoppingProject.Application.Identity.Commands.CreateRole;
using ShoppingProject.Application.Identity.Commands.ForgotPassword;
using ShoppingProject.Application.Identity.Commands.Login;
using ShoppingProject.Application.Identity.Commands.RefreshToken;
using ShoppingProject.Application.Identity.Commands.Register;
using ShoppingProject.Application.Identity.Commands.ResetPassword;
using ShoppingProject.Application.Identity.Commands.UpdateMe;
using ShoppingProject.Application.Identity.Queries.GetAllUsers;
using ShoppingProject.Application.Identity.Queries.GetCurrentUserInfo;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly ISender _sender;

    public IdentityController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("users")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(
        typeof(ServiceResult<PaginatedList<UserInfoResponse>>),
        StatusCodes.Status200OK
    )]
    public async Task<ActionResult<ServiceResult<PaginatedList<UserInfoResponse>>>> GetAllUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10
    )
    {
        return Ok(await _sender.Send(new GetAllUsersQuery(pageNumber, pageSize)));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<AuthResponse>>> Login(LoginCommand command)
    {
        return Ok(await _sender.Send(command));
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<AuthResponse>>> RefreshToken(
        RefreshTokenCommand command
    )
    {
        return Ok(await _sender.Send(command));
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> Register(RegisterCommand command) =>
        Ok(await _sender.Send(command));

    [HttpPost("{userId}/assign-admin-role")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> AssignAdminRole(string userId) =>
        Ok(await _sender.Send(new AssignAdminRoleCommand(userId, Roles.Administrator)));

    [HttpPost("roles/{roleName}")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> CreateRole(string roleName) =>
        Ok(await _sender.Send(new CreateRoleCommand(roleName)));

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ServiceResult<UserInfoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ServiceResult<UserInfoResponse>>> GetCurrentUserInfo()
    {
        return Ok(await _sender.Send(new GetCurrentUserInfoQuery()));
    }

    [HttpPut("me")]
    [Authorize]
    [ProducesResponseType(typeof(ServiceResult<UserInfoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ServiceResult<UserInfoResponse>>> UpdateMe(
        UpdateMeCommand command
    )
    {
        return Ok(await _sender.Send(command));
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> ForgotPassword(
        ForgotPasswordCommand command
    )
    {
        return Ok(await _sender.Send(command));
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> ResetPassword(
        ResetPasswordCommand command
    )
    {
        return Ok(await _sender.Send(command));
    }
}
