using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching; 
using Moq;
using ShoppingProject.Application.Products.Commands.CreateProduct;
using ShoppingProject.Application.Products.Commands.DeleteProduct;
using ShoppingProject.Application.Products.Commands.UpdateProduct;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;
using Xunit;

namespace ShoppingProject.UnitTests.Presentation.Controllers;

public class ProductsControllerAuthorizationTests
{
    private readonly Mock<ISender> _senderMock;
    private readonly Mock<IOutputCacheStore> _outputCacheStoreMock; 
    private readonly ProductsController _controller;

    public ProductsControllerAuthorizationTests()
    {
        _senderMock = new Mock<ISender>();
        _outputCacheStoreMock = new Mock<IOutputCacheStore>(); 

        _controller = new ProductsController(_senderMock.Object, _outputCacheStoreMock.Object); // <-- düzeltildi
    }

    [Fact]
    public void GetAll_HasAllowAnonymousAttribute()
    {
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.GetAll));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void GetById_HasAllowAnonymousAttribute()
    {
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.GetById));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Search_HasAllowAnonymousAttribute()
    {
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Search));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Create_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Create));
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
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Update));
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
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Delete));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }
}
