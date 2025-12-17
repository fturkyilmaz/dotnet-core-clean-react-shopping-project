using Microsoft.AspNetCore.Authorization;
using Moq;
using MediatR;
using ShoppingProject.Domain.Constants;
using ShoppingProject.WebApi.Controllers;
using Xunit;

namespace ShoppingProject.UnitTests.Presentation.Controllers;

public class IdentityControllerAuthorizationTests
{
    private readonly Mock<ISender> _senderMock;
    private readonly IdentityController _controller;

    public IdentityControllerAuthorizationTests()
    {
        _senderMock = new Mock<ISender>();
        _controller = new IdentityController(_senderMock.Object);
    }

    [Fact]
    public void Login_HasAllowAnonymousAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.Login));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void RefreshToken_HasAllowAnonymousAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.RefreshToken));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void Register_HasAllowAnonymousAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.Register));
        var attributes = method?.GetCustomAttributes(typeof(AllowAnonymousAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void AssignAdminRole_HasAuthorizeAttributeWithRequireAdministratorRolePolicy()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.AssignAdminRole));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>().ToArray();
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.RequireAdministratorRole);
    }

    [Fact]
    public void CreateRole_HasAuthorizeAttributeWithRequireAdministratorRolePolicy()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.CreateRole));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false)
            .Cast<AuthorizeAttribute>().ToArray();
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
        Assert.Contains(attributes, a => a.Policy == Policies.RequireAdministratorRole);
    }

    [Fact]
    public void GetCurrentUserInfo_HasAuthorizeAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.GetCurrentUserInfo));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }

    [Fact]
    public void UpdateMe_HasAuthorizeAttribute()
    {
        var method = _controller.GetType().GetMethod(nameof(IdentityController.UpdateMe));
        var attributes = method?.GetCustomAttributes(typeof(AuthorizeAttribute), false);
        Assert.NotNull(attributes);
        Assert.NotEmpty(attributes);
    }
}
