using Microsoft.AspNetCore.Mvc;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public IdentityController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ServiceResult<string>>> Login(LoginRequest request)
    {
        var (result, token) = await _identityService.LoginAsync(request.Email, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(ServiceResult<string>.Fail(string.Join(", ", result.Errors)));
        }

        return Ok(ServiceResult<string>.Success(token));
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
