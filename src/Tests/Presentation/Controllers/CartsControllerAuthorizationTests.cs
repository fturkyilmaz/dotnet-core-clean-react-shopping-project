using MediatR;
using Microsoft.AspNetCore.Authorization;
using Moq;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;
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
        var method = _controller.GetType().GetMethod(nameof(CartsController.GetAll));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void GetById_HasAuthorizeAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(CartsController.GetById));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Create_HasAuthorizeAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(CartsController.Create));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Update_HasAuthorizeAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(CartsController.Update));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Delete_HasAuthorizeAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(CartsController.Delete));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void DeleteAll_HasAuthorizeAttributeWithCanPurgePolicy()
    {
        var method = _controller.GetType().GetMethod(nameof(CartsController.DeleteAll));
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanPurge);
    }
}
