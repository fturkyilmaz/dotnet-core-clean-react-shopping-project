using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OutputCaching;
using Moq;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;

namespace ShoppingProject.UnitTests.Presentation.Controllers;

public class ProductsControllerAuthorizationTests
{
    private readonly Mock<ISender> _senderMock;
    private readonly Mock<IOutputCacheStore> _outputCacheStoreMock;
    private readonly ProductsController _controller;

/// <summary>
/// Unit tests for the <see cref="ProductsController"/> class.
/// </summary>
    public ProductsControllerAuthorizationTests()
    {
        _senderMock = new Mock<ISender>();
        _outputCacheStoreMock = new Mock<IOutputCacheStore>();

        _controller = new ProductsController(_senderMock.Object, _outputCacheStoreMock.Object);
    }

    [Fact]
    public void GetAll_HasAllowAnonymousAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(ProductsController.GetAll));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void GetById_HasAllowAnonymousAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(ProductsController.GetById));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Search_HasAllowAnonymousAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(ProductsController.Search));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Create_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        var method = _controller.GetType().GetMethod(nameof(ProductsController.Create));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }

    [Fact]
    public void Update_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        var method = _controller.GetType().GetMethod(nameof(ProductsController.Update));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }

    [Fact]
    public void Delete_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        var method = _controller.GetType().GetMethod(nameof(ProductsController.Delete));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }
}
