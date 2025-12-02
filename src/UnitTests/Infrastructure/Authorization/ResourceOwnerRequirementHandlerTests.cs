using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Authorization;
using Xunit;

namespace ShoppingProject.UnitTests.Infrastructure.Authorization;

public class ResourceOwnerRequirementHandlerTests
{
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly ResourceOwnerRequirementHandler _handler;

    public ResourceOwnerRequirementHandlerTests()
    {
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        _contextMock = new Mock<IApplicationDbContext>();
        _handler = new ResourceOwnerRequirementHandler(
            _httpContextAccessorMock.Object,
            _contextMock.Object
        );
    }

    [Fact]
    public async Task HandleRequirementAsync_AdministratorRole_Succeeds()
    {
        // Arrange
        var requirement = new ResourceOwnerRequirement("Client");
        var user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, "admin-user-id"),
                    new Claim(ClaimTypes.Role, Roles.Administrator),
                }
            )
        );
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleRequirementAsync_UnauthenticatedUser_Fails()
    {
        // Arrange
        var requirement = new ResourceOwnerRequirement("Client");
        var user = new ClaimsPrincipal(new ClaimsIdentity()); // No claims
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleRequirementAsync_NoHttpContext_Fails()
    {
        // Arrange
        var requirement = new ResourceOwnerRequirement("Client");
        var user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, "user-id"),
                    new Claim(ClaimTypes.Role, Roles.Client),
                }
            )
        );
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns((HttpContext?)null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleRequirementAsync_NoResourceId_Fails()
    {
        // Arrange
        var requirement = new ResourceOwnerRequirement("Client");
        var user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, "user-id"),
                    new Claim(ClaimTypes.Role, Roles.Client),
                }
            )
        );
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        var httpContext = new DefaultHttpContext();
        httpContext.Request.RouteValues.Clear(); // No route values
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleRequirementAsync_ClientRole_Fails()
    {
        // Arrange
        var requirement = new ResourceOwnerRequirement("Client");
        var user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, "client-user-id"),
                    new Claim(ClaimTypes.Role, Roles.Client),
                }
            )
        );
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        var httpContext = new DefaultHttpContext();
        httpContext.Request.RouteValues["id"] = "123";
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }
}
