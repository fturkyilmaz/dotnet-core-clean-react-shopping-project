using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    private readonly ProductsController _controller;

    public ProductsControllerAuthorizationTests()
    {
        _senderMock = new Mock<ISender>();
        _controller = new ProductsController(_senderMock.Object);
    }

    [Fact]
    public void GetAll_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.GetAll));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void GetById_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.GetById));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Search_HasAllowAnonymousAttribute()
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Search));

        // Act
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Create_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Create));

        // Act
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }

    [Fact]
    public void Update_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Update));

        // Act
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }

    [Fact]
    public void Delete_HasAuthorizeAttributeWithCanManageProductsPolicy()
    {
        // Arrange
        var method = typeof(ProductsController).GetMethod(nameof(ProductsController.Delete));

        // Act
        var attributes = method
            ?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>()
            .ToArray();

        // Assert
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.CanManageProducts);
    }
}
