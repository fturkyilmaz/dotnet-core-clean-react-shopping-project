using FluentAssertions;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.ValueObjects;

namespace ShoppingProject.UnitTests.Domain;

public class ProductTests
{
    [Fact]
    public void CreateProduct_WithValidData_ShouldSucceed()
    {
        string title = "Test Product";
        string description = "Test Description";
        decimal price = 19.99m;
        string category = "electronics";
        string image = "https://example.com/image.jpg";

        var product = new Product
        {
            Title = title,
            Description = description,
            Price = price,
            Category = category,
            Image = image,
        };

        product.Title.Should().Be(title);
        product.Description.Should().Be(description);
        product.Price.Should().Be(price);
        product.Category.Should().Be(category);
        product.Image.Should().Be(image);
    }

    [Fact]
    public void CreateProduct_WithRating_ShouldSucceed()
    {
        var rating = new Rating(4.5, 120);

        var product = new Product
        {
            Title = "Test Product",
            Description = "Test Description",
            Price = 29.99m,
            Rating = rating,
        };

        product.Rating.Should().NotBeNull();
        product.Rating.Rate.Should().Be(4.5);
        product.Rating.Count.Should().Be(120);
    }

    [Fact]
    public void CreateProduct_DefaultRating_ShouldBeInitialized()
    {
        var product = new Product
        {
            Title = "Test",
            Price = 10m,
            Description = "Test",
        };

        product.Rating.Should().NotBeNull();
        product.Rating.Rate.Should().Be(0.0);
        product.Rating.Count.Should().Be(0);
    }

    [Theory]
    [InlineData("electronics", 99.99)]
    [InlineData("clothing", 29.99)]
    [InlineData("books", 14.99)]
    public void CreateProduct_WithDifferentCategories_ShouldSucceed(string category, decimal price)
    {
        var product = new Product
        {
            Title = "Test Product",
            Description = "Test Description",
            Price = price,
            Category = category,
            Image = "test.jpg",
        };

        product.Category.Should().Be(category);
        product.Price.Should().Be(price);
    }

    [Fact]
    public void Product_ShouldInheritFromBaseAuditableEntity()
    {
        var product = new Product();

        product.Should().BeAssignableTo<ShoppingProject.Domain.Common.BaseAuditableEntity>();
    }

    [Fact]
    public void Product_ShouldHaveIdProperty()
    {
        var product = new Product
        {
            Title = "Test",
            Price = 100,
            Rating = new Rating(4.5, 100),
        };
        product.Id = 42;

        product.Id.Should().Be(42);
    }

    [Fact]
    public void Product_AllStringProperties_ShouldDefaultToEmpty()
    {
        var product = new Product();

        product.Title.Should().BeEmpty();
        product.Description.Should().BeEmpty();
        product.Category.Should().BeEmpty();
        product.Image.Should().BeEmpty();
    }
}
