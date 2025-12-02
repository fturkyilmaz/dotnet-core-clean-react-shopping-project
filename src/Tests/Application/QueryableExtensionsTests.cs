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
            new Product
            {
                Id = 1,
                Category = "women's clothing",
                Title = "Dress",
                Price = 50,
            },
            new Product
            {
                Id = 2,
                Category = "men's clothing",
                Title = "Shirt",
                Price = 40,
            },
            new Product
            {
                Id = 3,
                Category = "women's clothing",
                Title = "Skirt",
                Price = 30,
            },
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
            new Product
            {
                Id = 1,
                Category = "Women's Clothing",
                Title = "Dress",
                Price = 50,
            },
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
            new Product { Id = 1, Price = 50 },
            new Product { Id = 2, Price = 30 },
            new Product { Id = 3, Price = 40 },
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
            new Product { Id = 1, Price = 30 },
            new Product { Id = 2, Price = 50 },
            new Product { Id = 3, Price = 40 },
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
            new Product
            {
                Id = 1,
                Category = "electronics",
                Price = 100,
            },
            new Product
            {
                Id = 2,
                Category = "electronics",
                Price = 50,
            },
            new Product
            {
                Id = 3,
                Category = "clothing",
                Price = 75,
            },
            new Product
            {
                Id = 4,
                Category = "electronics",
                Price = 200,
            },
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
