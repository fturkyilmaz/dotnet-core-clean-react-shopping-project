using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using Asp.Versioning;

namespace ShoppingProject.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[AllowAnonymous]
public class IdentityController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public IdentityController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceResult<string>>> Login(LoginRequest request)
    {
        var (result, token) = await _identityService.LoginAsync(request.Email, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));
        }

        return Ok(ServiceResult<string>.Success(token));
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceResult<string>>> Register(RegisterRequest request)
    {
       var (result, userId) = await _identityService.CreateUserAsync(
            request.Email, 
            request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));
        }

        return Ok(ServiceResult<string>.Success("User registered successfully"));
    }

    [HttpPost("{userId}/assign-admin-role")]
    [AllowAnonymous] // TODO: In production, this should require admin authentication
    public async Task<ActionResult<ServiceResult<string>>> AssignAdminRole(string userId)
    {
        var result = await _identityService.AddUserToRoleAsync(userId, "Administrator");

        if (!result.Succeeded)
        {
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));
        }

        return Ok(ServiceResult<string>.Success("Administrator role assigned successfully"));
    }

    [HttpPost("roles/{roleName}")]
    [AllowAnonymous] // TODO: In production, this should require admin authentication
    public async Task<ActionResult<ServiceResult<string>>> CreateRole(string roleName)
    {
        var result = await _identityService.CreateRoleAsync(roleName);

        if (!result.Succeeded)
        {
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));
        }

        return Ok(ServiceResult<string>.Success($"Role '{roleName}' created successfully"));
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
