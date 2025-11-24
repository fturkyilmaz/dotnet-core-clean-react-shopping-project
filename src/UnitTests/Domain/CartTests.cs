using FluentAssertions;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.UnitTests.Domain;

public class CartTests
{
    [Fact]
    public void CreateCart_WithValidData_ShouldSucceed()
    {
        // Arrange
        string title = "Test Product";
        decimal price = 29.99m;
        string image = "https://example.com/image.jpg";
        int quantity = 2;

        // Act
        var cart = new Cart
        {
            Title = title,
            Price = price,
            Image = image,
            Quantity = quantity,
        };

        // Assert
        cart.Title.Should().Be(title);
        cart.Price.Should().Be(price);
        cart.Image.Should().Be(image);
        cart.Quantity.Should().Be(quantity);
    }

    [Fact]
    public void CreateCart_DefaultQuantity_ShouldBeOne()
    {
        // Act
        var cart = new Cart
        {
            Title = "Test",
            Price = 10m,
            Image = "test.jpg",
        };

        // Assert
        cart.Quantity.Should().Be(1);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(5)]
    [InlineData(100)]
    public void SetQuantity_WithValidQuantity_ShouldSucceed(int quantity)
    {
        // Arrange
        var cart = new Cart
        {
            Title = "Test",
            Price = 10m,
            Image = "test.jpg",
        };

        // Act
        cart.Quantity = quantity;

        // Assert
        cart.Quantity.Should().Be(quantity);
    }

    [Fact]
    public void Cart_ShouldInheritFromBaseAuditableEntity()
    {
        // Arrange & Act
        var cart = new Cart();

        // Assert
        cart.Should().BeAssignableTo<ShoppingProject.Domain.Common.BaseAuditableEntity>();
    }

    [Fact]
    public void Cart_ShouldHaveIdProperty()
    {
        // Arrange & Act
        var cart = new Cart
        {
            Title = "Test",
            Price = 10m,
            Image = "test.jpg",
        };
        cart.Id = 42;

        // Assert
        cart.Id.Should().Be(42);
    }
}
