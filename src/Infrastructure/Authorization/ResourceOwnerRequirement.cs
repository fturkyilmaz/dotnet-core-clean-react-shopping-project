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

        // For resource-based authorization, check ownership
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return;
        }

        // Extract resource ID from route
        var resourceId = httpContext.Request.RouteValues["id"]?.ToString();
        if (string.IsNullOrEmpty(resourceId))
        {
            return;
        }

        // Check ownership based on resource type
        var isOwner = requirement.ResourceType switch
        {
            "Client" => await CheckClientOwnership(userId, resourceId),
            "Cart" => await CheckCartOwnership(userId, resourceId),
            _ => false,
        };

        if (isOwner)
        {
            context.Succeed(requirement);
        }
    }

    private async Task<bool> CheckClientOwnership(string userId, string clientId)
    {
        // For Clients: check if it's their own profile
        // This is a placeholder - implement based on your domain model
        // Example: return await _context.Clients.AnyAsync(c => c.Id == clientId && c.DietitianId == userId);
        return await Task.FromResult(false);
    }

    private async Task<bool> CheckCartOwnership(string userId, string cartId)
    {
        // Check if the cart belongs to the current user
        // This is a placeholder - implement based on your domain model
        return await Task.FromResult(false);
    }
}
