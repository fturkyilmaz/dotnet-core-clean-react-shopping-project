using FluentAssertions;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.ValueObjects;
using Xunit;

namespace ShoppingProject.UnitTests.Domain;

public class ProductTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateProduct()
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var description = "A test product description";
        var category = "Electronics";
        var image = "https://example.com/product.jpg";

        // Act
        var product = Product.Create(title, price, description, category, image);

        // Assert
        product.Should().NotBeNull();
        product.Title.Should().Be(title);
        product.Price.Should().Be(price);
        product.Description.Should().Be(description);
        product.Category.Should().Be(category);
        product.Image.Should().Be(image);
        product.Rating.Should().BeEquivalentTo(new Rating(0, 0));
        product.Status.Should().Be(EntityStatus.Active);
    }

    [Fact]
    public void Create_ShouldRaiseProductCreatedEvent()
    {
        // Arrange
        var title = "Test Product";
        var price = 99.99m;
        var description = "A test product";
        var category = "Electronics";
        var image = "https://example.com/product.jpg";

        // Act
        var product = Product.Create(title, price, description, category, image);

        // Assert
        product.DomainEvents.Should().ContainSingle();
        product.DomainEvents.First().Should().BeOfType<ProductCreatedEvent>();
    }

    [Fact]
    public void UpdateDetails_WithValidData_ShouldUpdateProduct()
    {
        // Arrange
        var product = Product.Create("Old Title", 50m, "Old Desc", "Old Category", "old.jpg");
        product.ClearDomainEvents();

        // Act
        product.UpdateDetails("New Title", "New Desc", "New Category", "new.jpg");

        // Assert
        product.Title.Should().Be("New Title");
        product.Description.Should().Be("New Desc");
        product.Category.Should().Be("New Category");
        product.Image.Should().Be("new.jpg");
    }

    [Fact]
    public void UpdateDetails_ShouldRaiseProductUpdatedEvent()
    {
        // Arrange
        var product = Product.Create("Old Title", 50m, "Old Desc", "Old Category", "old.jpg");
        product.ClearDomainEvents();

        // Act
        product.UpdateDetails("New Title", "New Desc", "New Category", "new.jpg");

        // Assert
        product.DomainEvents.Should().ContainSingle();
        var domainEvent = product.DomainEvents.First() as ProductUpdatedEvent;
        domainEvent.Should().NotBeNull();
        domainEvent!.ProductId.Should().Be(product.Id);
        domainEvent.ProductName.Should().Be("New Title");
    }

    [Fact]
    public void UpdatePrice_WithDifferentValue_ShouldUpdateAndRaiseEvent()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.ClearDomainEvents();

        // Act
        product.UpdatePrice(75m);

        // Assert
        product.Price.Should().Be(75m);
        product.DomainEvents.Should().ContainSingle();
        var domainEvent = product.DomainEvents.First() as ProductPriceChangedEvent;
        domainEvent.Should().NotBeNull();
        domainEvent!.OldPrice.Should().Be(50m);
        domainEvent.NewPrice.Should().Be(75m);
    }

    [Fact]
    public void UpdatePrice_WithSameValue_ShouldNotRaiseEvent()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.ClearDomainEvents();

        // Act
        product.UpdatePrice(50m);

        // Assert
        product.Price.Should().Be(50m);
        product.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void UpdateRating_ShouldUpdateAndRaiseEvent()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.ClearDomainEvents();
        var newRating = new Rating(4.5, 100);

        // Act
        product.UpdateRating(newRating);

        // Assert
        product.Rating.Should().BeEquivalentTo(newRating);
        product.DomainEvents.Should().ContainSingle();
        var domainEvent = product.DomainEvents.First() as ProductRatingUpdatedEvent;
        domainEvent.Should().NotBeNull();
        domainEvent!.NewRating.Should().Be(4.5);
        domainEvent.TotalRatings.Should().Be(100);
    }

    [Fact]
    public void UpdateStatus_ShouldUpdateAndRaiseEvent()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.ClearDomainEvents();

        // Act
        product.UpdateStatus(EntityStatus.Passive);

        // Assert
        product.Status.Should().Be(EntityStatus.Passive);
        product.DomainEvents.Should().ContainSingle();
        var domainEvent = product.DomainEvents.First() as ProductStatusChangedEvent;
        domainEvent.Should().NotBeNull();
        domainEvent!.Status.Should().Be(EntityStatus.Passive);
    }

    [Fact]
    public void Activate_ShouldSetStatusToActive()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.UpdateStatus(EntityStatus.Passive);
        product.ClearDomainEvents();

        // Act
        product.Activate();

        // Assert
        product.Status.Should().Be(EntityStatus.Active);
    }

    [Fact]
    public void Deactivate_ShouldSetStatusToPassive()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.ClearDomainEvents();

        // Act
        product.Deactivate();

        // Assert
        product.Status.Should().Be(EntityStatus.Passive);
    }

    [Fact]
    public void MarkAsDeleted_ShouldSetStatusToDeleted()
    {
        // Arrange
        var product = Product.Create("Test", 50m, "Desc", "Category", "image.jpg");
        product.ClearDomainEvents();

        // Act
        product.MarkAsDeleted();

        // Assert
        product.Status.Should().Be(EntityStatus.Deleted);
    }
}
