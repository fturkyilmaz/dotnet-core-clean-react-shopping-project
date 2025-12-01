using Microsoft.AspNetCore.Authorization;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;
using Xunit;

namespace ShoppingProject.UnitTests.Presentation.Controllers;

public class IdentityControllerAuthorizationTests
{
    private readonly Mock<IIdentityService> _identityServiceMock;
    private readonly IdentityController _controller;

    public IdentityControllerAuthorizationTests()
    {
        _identityServiceMock = new Mock<IIdentityService>();
        _controller = new IdentityController(_identityServiceMock.Object);
    }

    [Fact]
    public void Login_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(nameof(IdentityController.Login));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void RefreshToken_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(nameof(IdentityController.RefreshToken));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Register_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(nameof(IdentityController.Register));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void AssignAdminRole_HasAuthorizeAttributeWithRequireAdministratorRolePolicy()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(
            nameof(IdentityController.AssignAdminRole)
        );

        // Act
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.RequireAdministratorRole);
    }

    [Fact]
    public void CreateRole_HasAuthorizeAttributeWithRequireAdministratorRolePolicy()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(nameof(IdentityController.CreateRole));

        // Act
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.RequireAdministratorRole);
    }

    [Fact]
    public void GetCurrentUserInfo_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(
            nameof(IdentityController.GetCurrentUserInfo)
        );

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void UpdateUser_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(IdentityController).GetMethod(nameof(IdentityController.UpdateUser));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }
}
