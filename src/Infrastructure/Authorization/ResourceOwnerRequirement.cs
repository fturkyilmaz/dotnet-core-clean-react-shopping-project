using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Infrastructure.Authorization;

public class ResourceOwnerRequirement : IAuthorizationRequirement
{
    public string ResourceType { get; }

    public ResourceOwnerRequirement(string resourceType)
    {
        ResourceType = resourceType;
    }
}

public class ResourceOwnerRequirementHandler : AuthorizationHandler<ResourceOwnerRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IApplicationDbContext _context;

    public ResourceOwnerRequirementHandler(
        IHttpContextAccessor httpContextAccessor,
        IApplicationDbContext context
    )
    {
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOwnerRequirement requirement
    )
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return;
        }

        // Administrators always have access
        if (context.User.IsInRole(Roles.Administrator))
        {
            context.Succeed(requirement);
            return;
        }

        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return;
        }

        var resourceId = httpContext.Request.RouteValues["id"]?.ToString();
        if (string.IsNullOrEmpty(resourceId))
        {
            return;
        }

        if (!int.TryParse(resourceId, out var id))
        {
            return;
        }

        bool isOwner = requirement.ResourceType switch
        {
            "Cart" => await _context.Carts.AnyAsync(c => c.Id == id && c.OwnerId == userId),
            _ => false,
        };

        if (isOwner)
        {
            context.Succeed(requirement);
        }
    }
}
