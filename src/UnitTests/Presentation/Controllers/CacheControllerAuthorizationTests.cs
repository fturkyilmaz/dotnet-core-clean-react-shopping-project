using Microsoft.AspNetCore.Authorization;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;
using Xunit;

namespace ShoppingProject.UnitTests.Presentation.Controllers;

public class CacheControllerAuthorizationTests
{
    private readonly Mock<IRedisCacheService> _redisCacheServiceMock;
    private readonly CacheController _controller;

    public CacheControllerAuthorizationTests()
    {
        _redisCacheServiceMock = new Mock<IRedisCacheService>();
        _controller = new CacheController(_redisCacheServiceMock.Object);
    }

    [Fact]
    public void Controller_HasAuthorizeAttributeWithRequireAdministratorRolePolicy()
    {
        // Arrange
        var controllerType = typeof(CacheController);

        // Act
        var attributes = controllerType
            .GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.RequireAdministratorRole);
    }

    [Fact]
    public void Get_InheritsControllerAuthorization()
    {
        // Arrange
        var method = typeof(CacheController).GetMethod(nameof(CacheController.Get));
        var controllerType = typeof(CacheController);

        // Act
        var controllerAttributes = controllerType.GetCustomAttributes(
            typeof(AuthorizeAttribute),
            false
        );

        // Assert
        Assert.NotNull(method);
        Assert.NotEmpty(controllerAttributes);
    }

    [Fact]
    public void Set_InheritsControllerAuthorization()
    {
        // Arrange
        var method = typeof(CacheController).GetMethod(nameof(CacheController.Set));
        var controllerType = typeof(CacheController);

        // Act
        var controllerAttributes = controllerType.GetCustomAttributes(
            typeof(AuthorizeAttribute),
            false
        );

        // Assert
        Assert.NotNull(method);
        Assert.NotEmpty(controllerAttributes);
    }

    [Fact]
    public void Delete_InheritsControllerAuthorization()
    {
        // Arrange
        var method = typeof(CacheController).GetMethod(nameof(CacheController.Delete));
        var controllerType = typeof(CacheController);

        // Act
        var controllerAttributes = controllerType.GetCustomAttributes(
            typeof(AuthorizeAttribute),
            false
        );

        // Assert
        Assert.NotNull(method);
        Assert.NotEmpty(controllerAttributes);
    }
}
