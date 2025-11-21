using ShoppingProject.Application.Common.Extensions;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;
using Xunit;

namespace ShoppingProject.UnitTests.Application;

public class QueryableExtensionsTests
{
    [Fact]
    public void ToDynamic_ShouldFilterByStringEquality()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = 1, Category = "women's clothing", Title = "Dress", Price = 50 },
            new Product { Id = 2, Category = "men's clothing", Title = "Shirt", Price = 40 },
            new Product { Id = 3, Category = "women's clothing", Title = "Skirt", Price = 30 }
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Filter = new Filter
            {
                Field = "Category",
                Operator = "eq",
                Value = "women's clothing"
            }
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, p => Assert.Equal("women's clothing", p.Category));
    }

    [Fact]
    public void ToDynamic_ShouldBeCaseInsensitive()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = 1, Category = "Women's Clothing", Title = "Dress", Price = 50 }
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Filter = new Filter
            {
                Field = "Category",
                Operator = "eq",
                Value = "women's clothing"
            }
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        Assert.Single(result);
        Assert.Equal("Women's Clothing", result[0].Category);
    }
    
    [Fact]
    public void ToDynamic_ShouldSort()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = 1, Price = 50 },
            new Product { Id = 2, Price = 30 },
            new Product { Id = 3, Price = 40 }
        }.AsQueryable();

        var query = new DynamicQuery
        {
            Sort = new List<Sort>
            {
                new Sort { Field = "Price", Dir = "asc" }
            }
        };

        // Act
        var result = products.ToDynamic(query).ToList();

        // Assert
        Assert.Equal(30, result[0].Price);
        Assert.Equal(40, result[1].Price);
        Assert.Equal(50, result[2].Price);
    }
}
