using FluentAssertions;
using ShoppingProject.Application.Common.Extensions;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.UnitTests.Application;

public class QueryableExtensionsTests
{
    [Fact]
    public void ToDynamic_ShouldFilterByStringEquality()
    {
        // Arrange
        var products = new List<Product>
        {
            Product.Create("Dress", 50, "Nice dress", "women's clothing", "dress.jpg"),
            Product.Create("Shirt", 40, "Cool shirt", "men's clothing", "shirt.jpg"),
            Product.Create("Skirt", 30, "Skirt desc", "women's clothing", "skirt.jpg"),
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Filter = new Filter
            {
                Field = "Category",
                Operator = "eq",
                Value = "women's clothing",
            },
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        result.Should().HaveCount(2);
        result.Should().AllSatisfy(p => p.Category.Should().Be("women's clothing"));
    }

    [Fact]
    public void ToDynamic_ShouldBeCaseInsensitive()
    {
        // Arrange
        var products = new List<Product>
        {
            Product.Create("Dress", 50, "Desc", "Women's Clothing", "dress.jpg"),
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Filter = new Filter
            {
                Field = "Category",
                Operator = "eq",
                Value = "women's clothing",
            },
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        result.Should().ContainSingle();
        result[0].Category.Should().Be("Women's Clothing");
    }

    [Fact]
    public void ToDynamic_ShouldSortAscending()
    {
        // Arrange
        var products = new List<Product>
        {
            Product.Create("A", 50, "Desc", "Cat", "a.jpg"),
            Product.Create("B", 30, "Desc", "Cat", "b.jpg"),
            Product.Create("C", 40, "Desc", "Cat", "c.jpg"),
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Sort = new List<Sort>
            {
                new Sort { Field = "Price", Dir = "asc" },
            },
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        result.Should().HaveCount(3);
        result[0].Price.Should().Be(30);
        result[1].Price.Should().Be(40);
        result[2].Price.Should().Be(50);
    }

    [Fact]
    public void ToDynamic_ShouldSortDescending()
    {
        // Arrange
        var products = new List<Product>
        {
            Product.Create("A", 30, "Desc", "Cat", "a.jpg"),
            Product.Create("B", 50, "Desc", "Cat", "b.jpg"),
            Product.Create("C", 40, "Desc", "Cat", "c.jpg"),
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Sort = new List<Sort>
            {
                new Sort { Field = "Price", Dir = "desc" },
            },
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        result.Should().HaveCount(3);
        result[0].Price.Should().Be(50);
        result[1].Price.Should().Be(40);
        result[2].Price.Should().Be(30);
    }

    [Fact]
    public void ToDynamic_ShouldFilterAndSort()
    {
        // Arrange
        var products = new List<Product>
        {
            Product.Create("A", 100, "Desc", "electronics", "a.jpg"),
            Product.Create("B", 50, "Desc", "electronics", "b.jpg"),
            Product.Create("C", 75, "Desc", "clothing", "c.jpg"),
            Product.Create("D", 200, "Desc", "electronics", "d.jpg"),
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Filter = new Filter
            {
                Field = "Category",
                Operator = "eq",
                Value = "electronics",
            },
            Sort = new List<Sort>
            {
                new Sort { Field = "Price", Dir = "asc" },
            },
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        result.Should().HaveCount(3);
        result.Should().AllSatisfy(p => p.Category.Should().Be("electronics"));
        result[0].Price.Should().Be(50);
        result[1].Price.Should().Be(100);
        result[2].Price.Should().Be(200);
    }
}
