using System.Net;
using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public IdentityController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<AuthResponse>>> Login(LoginRequest request)
    {
        var (result, response) = await _identityService.LoginAsync(request.Email, request.Password);

        if (!result.Succeeded)
            return BadRequest(ServiceResult<AuthResponse>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<AuthResponse>.Success(response!));
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<AuthResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<AuthResponse>>> RefreshToken(
        RefreshTokenRequest request
    )
    {
        var (result, response) = await _identityService.RefreshTokenAsync(
            request.AccessToken,
            request.RefreshToken
        );

        if (!result.Succeeded)
            return BadRequest(ServiceResult<AuthResponse>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<AuthResponse>.Success(response!));
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> Register(RegisterRequest request)
    {
        var (result, _) = await _identityService.CreateUserAsync(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.Gender ?? "Unknown", // default gender
            Roles.Client
        );

        if (!result.Succeeded)
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<string>.Success("User registered successfully"));
    }

    [HttpPost("{userId}/assign-admin-role")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> AssignAdminRole(string userId)
    {
        var result = await _identityService.AddUserToRoleAsync(userId, "Administrator");

        if (!result.Succeeded)
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<string>.Success("Administrator role assigned successfully"));
    }

    [HttpPost("roles/{roleName}")]
    [Authorize(Policy = Policies.RequireAdministratorRole)]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> CreateRole(string roleName)
    {
        var result = await _identityService.CreateRoleAsync(roleName);

        if (!result.Succeeded)
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<string>.Success($"Role '{roleName}' created successfully"));
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ServiceResult<UserInfoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ServiceResult<UserInfoResponse>>> GetCurrentUserInfo()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(
                ServiceResult<UserInfoResponse>.Fail(
                    "User not authorized",
                    HttpStatusCode.Unauthorized
                )
            );

        var user = await _identityService.GetUserByIdAsync(userId);
        if (!user.Result.Succeeded || user.Response == null)
            return NotFound(
                ServiceResult<UserInfoResponse>.Fail("User not found", HttpStatusCode.NotFound)
            );

        var response = new UserInfoResponse
        {
            Id = user.Response.Id,
            Email = user.Response.Email ?? string.Empty,
            FirstName = user.Response.FirstName,
            LastName = user.Response.LastName,
            UserName = user.Response.UserName,
            Gender = user.Response.Gender,
        };

        return Ok(ServiceResult<UserInfoResponse>.Success(response));
    }

    [HttpPut("me")]
    [Authorize]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> UpdateUser(UpdateUserRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(
                ServiceResult<string>.Fail("User not authorized", HttpStatusCode.Unauthorized)
            );

        var result = await _identityService.UpdateUserAsync(
            userId,
            request.FirstName ?? string.Empty,
            request.LastName ?? string.Empty,
            request.Gender ?? string.Empty
        );

        if (!result.Succeeded)
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<string>.Success("User updated successfully"));
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> ForgotPassword(
        ForgotPasswordRequest request
    )
    {
        var result = await _identityService.RequestPasswordResetAsync(request.Email);
        if (!result.Succeeded)
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<string>.Success("Reset maili gönderildi."));
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResult<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ServiceResult<string>>> ResetPassword(
        ResetPasswordRequest request
    )
    {
        var result = await _identityService.ResetPasswordAsync(
            request.Email,
            request.Token,
            request.NewPassword
        );

        if (!result.Succeeded)
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));

        return Ok(ServiceResult<string>.Success("Şifre güncellendi."));
    }
}
