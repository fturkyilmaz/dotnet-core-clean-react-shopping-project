using MediatR;
using Microsoft.AspNetCore.Authorization;
using Moq;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;
using Xunit;

namespace ShoppingProject.UnitTests.Presentation.Controllers;

public class CartsControllerAuthorizationTests
{
    private readonly Mock<ISender> _senderMock;
    private readonly CartsController _controller;

    public CartsControllerAuthorizationTests()
    {
        _senderMock = new Mock<ISender>();
        _controller = new CartsController(_senderMock.Object);
    }

    [Fact]
    public void GetAll_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(CartsController).GetMethod(nameof(CartsController.GetAll));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void GetById_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(CartsController).GetMethod(nameof(CartsController.GetById));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Create_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(CartsController).GetMethod(nameof(CartsController.Create));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Update_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(CartsController).GetMethod(nameof(CartsController.Update));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Delete_HasAuthorizeAttribute()
    {
        // Arrange
        var method = typeof(CartsController).GetMethod(nameof(CartsController.Delete));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void DeleteAll_HasAuthorizeAttributeWithCanPurgePolicy()
    {
        // Arrange
        var method = typeof(CartsController).GetMethod(nameof(CartsController.DeleteAll));

        // Act
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanPurge);
    }
}
