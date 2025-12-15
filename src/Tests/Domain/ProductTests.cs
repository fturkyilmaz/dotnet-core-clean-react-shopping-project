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

        var product = Product.Create(title, price, description, category, image);

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

        var product = Product.Create(
            "Test Product",
            29.99m,
            "Test Description",
            string.Empty,
            string.Empty
        );
        product.UpdateRating(rating);

        product.Rating.Should().NotBeNull();
        product.Rating.Rate.Should().Be(4.5);
        product.Rating.Count.Should().Be(120);
    }

    [Fact]
    public void CreateProduct_DefaultRating_ShouldBeInitialized()
    {
        var product = Product.Create("Test", 10m, "Test", string.Empty, string.Empty);

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
        var product = Product.Create(
            "Test Product",
            price,
            "Test Description",
            category,
            "test.jpg"
        );

        product.Category.Should().Be(category);
        product.Price.Should().Be(price);
    }

    [Fact]
    public void Product_ShouldInheritFromBaseAuditableEntity()
    {
        var product = Product.Create("Test", 10m, "Desc", "Cat", "Img");

        product.Should().BeAssignableTo<ShoppingProject.Domain.Common.BaseAuditableEntity>();
    }

    [Fact]
    public void Product_ShouldHaveIdProperty()
    {
        var product = Product.Create("Test", 100, "Desc", "Cat", "Img");
        product.UpdateRating(new Rating(4.5, 100));

        product.Id = 42;

        product.Id.Should().Be(42);
    }

    [Fact]
    public void Product_ShouldHaveBehaviorMethods()
    {
        // New test to verify behavior
        var product = Product.Create("Test", 100, "Desc", "Cat", "Img");
        product.UpdateDetails("New Title", "New Desc", "New Cat", "New Img");
        product.UpdatePrice(200);

        product.Title.Should().Be("New Title");
        product.Price.Should().Be(200);
    }
}
