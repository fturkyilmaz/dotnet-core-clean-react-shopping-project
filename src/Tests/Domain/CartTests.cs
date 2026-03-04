using FluentAssertions;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.Exceptions;
using Xunit;

namespace ShoppingProject.UnitTests.Domain;

public class CartTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateCart()
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 2;
        var ownerId = "user123";

        // Act
        var cart = Cart.Create(title, price, image, quantity, ownerId);

        // Assert
        cart.Should().NotBeNull();
        cart.Title.Should().Be(title);
        cart.Price.Should().Be(price);
        cart.Image.Should().Be(image);
        cart.Quantity.Should().Be(quantity);
        cart.OwnerId.Should().Be(ownerId);
        cart.TotalPrice.Should().Be(price * quantity);
    }

    [Fact]
    public void Create_ShouldRaiseCartCreatedEvent()
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 2;
        var ownerId = "user123";

        // Act
        var cart = Cart.Create(title, price, image, quantity, ownerId);

        // Assert
        cart.DomainEvents.Should().ContainSingle();
        var domainEvent = cart.DomainEvents.First() as CartCreatedEvent;
        domainEvent.Should().NotBeNull();
        domainEvent!.Title.Should().Be(title);
        domainEvent.Price.Should().Be(price);
        domainEvent.Quantity.Should().Be(quantity);
        domainEvent.OwnerId.Should().Be(ownerId);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Create_WithEmptyTitle_ShouldThrowDomainException(string invalidTitle)
    {
        // Arrange
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 2;
        var ownerId = "user123";

        // Act & Assert
        var action = () => Cart.Create(invalidTitle!, price, image, quantity, ownerId);
        action.Should().Throw<DomainException>().WithMessage("*title cannot be empty*");
    }

    [Fact]
    public void Create_WithLongTitle_ShouldThrowDomainException()
    {
        // Arrange
        var title = new string('a', 201);
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 2;
        var ownerId = "user123";

        // Act & Assert
        var action = () => Cart.Create(title, price, image, quantity, ownerId);
        action.Should().Throw<DomainException>().WithMessage("*cannot exceed 200 characters*");
    }

    [Fact]
    public void Create_WithNegativePrice_ShouldThrowDomainException()
    {
        // Arrange
        var title = "Test Product";
        var price = -10m;
        var image = "https://example.com/image.jpg";
        var quantity = 2;
        var ownerId = "user123";

        // Act & Assert
        var action = () => Cart.Create(title, price, image, quantity, ownerId);
        action.Should().Throw<DomainException>().WithMessage("*price cannot be negative*");
    }

    [Fact]
    public void Create_WithZeroQuantity_ShouldThrowDomainException()
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 0;
        var ownerId = "user123";

        // Act & Assert
        var action = () => Cart.Create(title, price, image, quantity, ownerId);
        action.Should().Throw<DomainException>().WithMessage("*quantity must be at least 1*");
    }

    [Fact]
    public void Create_WithExcessiveQuantity_ShouldThrowDomainException()
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 1001;
        var ownerId = "user123";

        // Act & Assert
        var action = () => Cart.Create(title, price, image, quantity, ownerId);
        action.Should().Throw<DomainException>().WithMessage("*cannot exceed 1000*");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Create_WithEmptyOwnerId_ShouldThrowDomainException(string invalidOwnerId)
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var image = "https://example.com/image.jpg";
        var quantity = 2;

        // Act & Assert
        var action = () => Cart.Create(title, price, image, quantity, invalidOwnerId!);
        action.Should().Throw<DomainException>().WithMessage("*owner ID cannot be empty*");
    }

    [Fact]
    public void UpdateQuantity_WithValidValue_ShouldUpdateAndRaiseEvent()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 1, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.UpdateQuantity(5);

        // Assert
        cart.Quantity.Should().Be(5);
        cart.DomainEvents.Should().ContainSingle();
        var domainEvent = cart.DomainEvents.First() as CartQuantityUpdatedEvent;
        domainEvent.Should().NotBeNull();
        domainEvent!.OldQuantity.Should().Be(1);
        domainEvent.NewQuantity.Should().Be(5);
    }

    [Fact]
    public void UpdateQuantity_WithSameValue_ShouldNotRaiseEvent()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 5, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.UpdateQuantity(5);

        // Assert
        cart.Quantity.Should().Be(5);
        cart.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void UpdateQuantity_WithZero_ShouldThrowDomainException()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 5, "user123");

        // Act & Assert
        var action = () => cart.UpdateQuantity(0);
        action.Should().Throw<DomainException>().WithMessage("*quantity must be at least 1*");
    }

    [Fact]
    public void IncreaseQuantity_ShouldAddToCurrentQuantity()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 5, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.IncreaseQuantity(3);

        // Assert
        cart.Quantity.Should().Be(8);
        cart.DomainEvents.Should().ContainSingle();
    }

    [Fact]
    public void IncreaseQuantity_WithZeroOrNegative_ShouldThrowDomainException()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 5, "user123");

        // Act & Assert
        var action = () => cart.IncreaseQuantity(0);
        action.Should().Throw<DomainException>().WithMessage("*Amount must be greater than zero*");
    }

    [Fact]
    public void TryDecreaseQuantity_WhenResultIsPositive_ShouldReturnTrue()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 5, "user123");
        cart.ClearDomainEvents();

        // Act
        var result = cart.TryDecreaseQuantity(3);

        // Assert
        result.Should().BeTrue();
        cart.Quantity.Should().Be(2);
        cart.DomainEvents.Should().ContainSingle();
    }

    [Fact]
    public void TryDecreaseQuantity_WhenResultIsZeroOrNegative_ShouldReturnFalse()
    {
        // Arrange
        var cart = Cart.Create("Test", 10m, "image.jpg", 3, "user123");
        cart.ClearDomainEvents();

        // Act
        var result = cart.TryDecreaseQuantity(5);

        // Assert
        result.Should().BeFalse();
        cart.Quantity.Should().Be(3); // Quantity should not change
        cart.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void UpdateDetails_WithChanges_ShouldUpdateAndRaiseEvent()
    {
        // Arrange
        var cart = Cart.Create("Old Title", 10m, "old.jpg", 5, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.UpdateDetails("New Title", 20m, "new.jpg");

        // Assert
        cart.Title.Should().Be("New Title");
        cart.Price.Should().Be(20m);
        cart.Image.Should().Be("new.jpg");
        cart.DomainEvents.Should().ContainSingle();
        cart.DomainEvents.First().Should().BeOfType<CartUpdatedEvent>();
    }

    [Fact]
    public void UpdateDetails_WithNoChanges_ShouldNotRaiseEvent()
    {
        // Arrange
        var cart = Cart.Create("Title", 10m, "image.jpg", 5, "user123");
        cart.ClearDomainEvents();

        // Act
        cart.UpdateDetails("Title", 10m, "image.jpg");

        // Assert
        cart.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void TotalPrice_ShouldBeCalculatedCorrectly()
    {
        // Arrange
        var cart = Cart.Create("Test", 49.99m, "image.jpg", 3, "user123");

        // Assert
        cart.TotalPrice.Should().Be(149.97m);
    }
}
