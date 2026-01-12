using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Services;

public class CurrentUser : IUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? Id =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string? Email =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

    public IReadOnlyCollection<string> GetRoles()
    {
        return _httpContextAccessor
                .HttpContext?.User?.FindAll(ClaimTypes.Role)
                .Select(c => c.Value)
                .ToArray() ?? Array.Empty<string>();
    }
}
