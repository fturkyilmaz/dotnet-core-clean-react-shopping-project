using FluentAssertions;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.Exceptions;

namespace ShoppingProject.UnitTests.Domain;

public class CartDomainTests
{
    [Fact]
    public void Create_ValidParameters_ShouldCreateCart()
    {
        // Act
        var cart = Cart.Create(
            title: "Test Product",
            price: 99.99m,
            image: "https://example.com/image.jpg",
            quantity: 2,
            ownerId: "user123"
        );

        // Assert
        cart.Should().NotBeNull();
        cart.Title.Should().Be("Test Product");
        cart.Price.Should().Be(99.99m);
        cart.Image.Should().Be("https://example.com/image.jpg");
        cart.Quantity.Should().Be(2);
        cart.OwnerId.Should().Be("user123");
    }

    [Theory]
    [InlineData(null, 10, "image", 1, "owner")]
    [InlineData("title", -1, "image", 1, "owner")]
    [InlineData("title", 10, "image", 0, "owner")]
    [InlineData("title", 10, "image", 1, null)]
    public void Create_InvalidParameters_ShouldThrowDomainException(
        string? title, decimal price, string image, int quantity, string? ownerId)
    {
        // Act & Assert
        Assert.Throws<DomainException>(() =>
            Cart.Create(title!, price, image, quantity, ownerId!));
    }

    [Fact]
    public void UpdateQuantity_ValidQuantity_ShouldUpdateQuantity()
    {
        // Arrange
        var cart = Cart.Create("Product", 100m, "image.jpg", 1, "user123");

        // Act
        cart.UpdateQuantity(5);

        // Assert
        cart.Quantity.Should().Be(5);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(1001)]
    public void UpdateQuantity_InvalidQuantity_ShouldThrowDomainException(int quantity)
    {
        // Arrange
        var cart = Cart.Create("Product", 100m, "image.jpg", 1, "user123");

        // Act & Assert
        Assert.Throws<DomainException>(() => cart.UpdateQuantity(quantity));
    }

    [Fact]
    public void TryDecreaseQuantity_SufficientQuantity_ShouldDecreaseAndReturnTrue()
    {
        // Arrange
        var cart = Cart.Create("Product", 100m, "image.jpg", 5, "user123");

        // Act
        var result = cart.TryDecreaseQuantity(2);

        // Assert
        result.Should().BeTrue();
        cart.Quantity.Should().Be(3);
    }

    [Fact]
    public void TryDecreaseQuantity_InsufficientQuantity_ShouldReturnFalse()
    {
        // Arrange
        var cart = Cart.Create("Product", 100m, "image.jpg", 2, "user123");

        // Act
        var result = cart.TryDecreaseQuantity(5);

        // Assert
        result.Should().BeFalse();
        cart.Quantity.Should().Be(2);
    }

    [Fact]
    public void UpdateDetails_ValidParameters_ShouldUpdateDetails()
    {
        // Arrange
        var cart = Cart.Create("Old Title", 100m, "old.jpg", 1, "user123");

        // Act
        cart.UpdateDetails("New Title", 200m, "new.jpg");

        // Assert
        cart.Title.Should().Be("New Title");
        cart.Price.Should().Be(200m);
        cart.Image.Should().Be("new.jpg");
    }

    [Fact]
    public void Create_ShouldRaiseCartCreatedEvent()
    {
        // Act
        var cart = Cart.Create("Product", 99.99m, "image.jpg", 1, "user123");

        // Assert
        cart.DomainEvents.Should().ContainSingle();
        cart.DomainEvents.First().Should().BeOfType<CartCreatedEvent>();

        var @event = cart.DomainEvents.First() as CartCreatedEvent;
        @event!.CartId.Should().Be(cart.Id);
        @event.Title.Should().Be("Product");
        @event.OwnerId.Should().Be("user123");
    }

    [Fact]
    public void UpdateQuantity_ShouldRaiseCartQuantityUpdatedEvent()
    {
        // Arrange
        var cart = Cart.Create("Product", 100m, "image.jpg", 1, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.UpdateQuantity(5);

        // Assert
        cart.DomainEvents.Should().ContainSingle();
        cart.DomainEvents.First().Should().BeOfType<CartQuantityUpdatedEvent>();

        var @event = cart.DomainEvents.First() as CartQuantityUpdatedEvent;
        @event!.CartId.Should().Be(cart.Id);
        @event.NewQuantity.Should().Be(5);
    }

    [Fact]
    public void UpdateDetails_ShouldRaiseCartUpdatedEvent()
    {
        // Arrange
        var cart = Cart.Create("Old Title", 100m, "old.jpg", 1, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.UpdateDetails("New Title", 200m, "new.jpg");

        // Assert
        cart.DomainEvents.Should().ContainSingle();
        cart.DomainEvents.First().Should().BeOfType<CartUpdatedEvent>();

        var @event = cart.DomainEvents.First() as CartUpdatedEvent;
        @event!.CartId.Should().Be(cart.Id);
    }
}
