using System.Net;
using System.Security.Claims;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;
using ShoppingProject.Application.Identity.Commands.AssignAdminRole;
using ShoppingProject.Application.Identity.Commands.CreateRole;
using ShoppingProject.Application.Identity.Commands.ForgotPassword;
using ShoppingProject.Application.Identity.Commands.Login;
using ShoppingProject.Application.Identity.Commands.RefreshToken;
using ShoppingProject.Application.Identity.Commands.Register;
using ShoppingProject.Application.Identity.Commands.ResetPassword;
using ShoppingProject.Application.Identity.Commands.UpdateMe;
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

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<AuthResponse>>> Login(LoginRequest request)
    {
        var result = await _sender.Send(new LoginCommand(request.Email, request.Password));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<AuthResponse>>> RefreshToken(
        RefreshTokenRequest request
    )
    {
        var result = await _sender.Send(new RefreshTokenCommand(request.AccessToken, request.RefreshToken));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> Register(RegisterRequest request)
    {
        var result = await _sender.Send(
           new RegisterCommand(
               request.Email,
               request.Password,
               request.FirstName,
               request.LastName,
               request.Gender ?? "Unknown",
               Roles.Client));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{userId}/assign-admin-role")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> AssignAdminRole(string userId)
    {
        var result = await _sender.Send(new AssignAdminRoleCommand(userId, Roles.Administrator));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost("roles/{roleName}")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> CreateRole(string roleName)
    {
        var result = await _sender.Send(new CreateRoleCommand(roleName));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ServiceResult<UserInfoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ServiceResult<UserInfoResponse>>> GetCurrentUserInfo()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(ServiceResult<UserInfoResponse>.Fail("Unauthorized"));

        var result = await _sender.Send(new GetCurrentUserInfoQuery(userId));

        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPut("me")]
[Authorize]
[ProducesResponseType(typeof(ServiceResult<UserInfoResponse>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<ActionResult<ServiceResult<UserInfoResponse>>> UpdateMe(
    UpdateUserRequest request)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrWhiteSpace(userId))
        return Unauthorized(ServiceResult<UserInfoResponse>.Fail("Unauthorized"));

    var result = await _sender.Send(
        new UpdateMeCommand(
            userId,
            request.FirstName ?? string.Empty,
            request.LastName ?? string.Empty,
            request.Gender ?? string.Empty
        )
    );

    return result.IsSuccess ? Ok(result) : BadRequest(result);
}


    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> ForgotPassword(
        ForgotPasswordRequest request
    )
    {
        var result = await _sender.Send(new ForgotPasswordCommand(request.Email));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> ResetPassword(
        ResetPasswordRequest request
    )
    {
        var result = await _sender.Send(
            new ResetPasswordCommand(
                request.Email,
                request.Token,
                request.NewPassword));

        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}
