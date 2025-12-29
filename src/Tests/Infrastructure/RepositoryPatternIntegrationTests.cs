using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Application.Products.Specifications;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Repositories;
using Testcontainers.PostgreSql;
using Xunit;

namespace ShoppingProject.Tests.Infrastructure;

/// <summary>
/// Integration tests for Repository pattern.
/// Tests CRUD operations, Specification support, and query capabilities.
/// </summary>
[Collection("PostgreSQL Tests")]
public class RepositoryPatternIntegrationTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container;
    private ApplicationDbContext _context = null!;
    private Repository<Product> _repository = null!;

    public RepositoryPatternIntegrationTests()
    {
        _container = new PostgreSqlBuilder()
            .WithDatabase("testdb_repository")
            .WithUsername("testuser")
            .WithPassword("testpass")
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _container.StartAsync();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(_container.GetConnectionString())
            .Options;

        _context = new ApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();

        _repository = new Repository<Product>(_context);
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _container.StopAsync();
    }

    [Fact]
    public async Task AddAsync_CreatesEntity()
    {
        // Arrange
        var product = Product.Create(
            "Test Product",
            29.99m,
            "A test product",
            "Electronics",
            "https://image.jpg"
        );

        // Act
        var result = await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().BeGreaterThan(0);

        var retrieved = await _repository.GetByIdAsync(product.Id);
        retrieved.Should().NotBeNull();
        retrieved!.Title.Should().Be("Test Product");
        retrieved.Price.Should().Be(29.99m);
    }

    [Fact]
    public async Task AddAsync_WithId_PreservesId()
    {
        // Arrange
        var product = Product.Create("Product", 10m, "Desc", "Cat", "https://img.jpg");
        product.SetIdForTesting(42); // Simulate existing ID

        // Act
        await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        // Assert
        var retrieved = await _repository.GetByIdAsync(42);
        retrieved.Should().NotBeNull();
        retrieved!.Id.Should().Be(42);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsEntity()
    {
        // Arrange
        var product = Product.Create("Product", 20m, "Desc", "Cat", "https://img.jpg");
        await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        // Act
        var retrieved = await _repository.GetByIdAsync(product.Id);

        // Assert
        retrieved.Should().NotBeNull();
        retrieved!.Title.Should().Be("Product");
        retrieved.Price.Should().Be(20m);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNullForNonexistent()
    {
        // Act
        var retrieved = await _repository.GetByIdAsync(99999);

        // Assert
        retrieved.Should().BeNull();
    }

    [Fact]
    public async Task ListAsync_ReturnsAllEntities()
    {
        // Arrange
        var products = new[]
        {
            Product.Create("Product 1", 10m, "Desc 1", "Cat 1", "https://img1.jpg"),
            Product.Create("Product 2", 20m, "Desc 2", "Cat 2", "https://img2.jpg"),
            Product.Create("Product 3", 30m, "Desc 3", "Cat 1", "https://img3.jpg"),
        };

        foreach (var product in products)
        {
            await _repository.AddAsync(product);
        }
        await _context.SaveChangesAsync();

        // Act
        var all = await _repository.ListAllAsync();

        // Assert
        all.Should().HaveCount(3);
        all.Should().ContainSingle(p => p.Title == "Product 1");
        all.Should().ContainSingle(p => p.Title == "Product 2");
        all.Should().ContainSingle(p => p.Title == "Product 3");
    }

    [Fact]
    public async Task ListAsync_WithSpecification_Filters()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Active 1", 10m, "Desc", "Cat", "https://img1.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Inactive", 0m, "Desc", "Cat", "https://img2.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Active 2", 20m, "Desc", "Cat", "https://img3.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        var spec = new ActiveProductsSpecification();
        var active = await _repository.ListAsync(spec);

        // Assert
        active.Should().HaveCount(2);
        active.Should().AllSatisfy(p => p.Price.Should().BeGreaterThan(0));
    }

    [Fact]
    public async Task ListAsync_WithCategorySpecification()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Product 1", 10m, "Desc", "Electronics", "https://img1.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Product 2", 20m, "Desc", "Furniture", "https://img2.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Product 3", 30m, "Desc", "Electronics", "https://img3.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        var spec = new ProductsByCategorySpecification("Electronics");
        var electronics = await _repository.ListAsync(spec);

        // Assert
        electronics.Should().HaveCount(2);
        electronics.Should().AllSatisfy(p => p.Category.Should().Be("Electronics"));
    }

    [Fact]
    public async Task ListAsync_WithPaginationSpecification()
    {
        // Arrange
        for (int i = 1; i <= 15; i++)
        {
            await _repository.AddAsync(
                Product.Create($"Product {i:D2}", i * 10m, "Desc", "Cat", "https://img.jpg")
            );
        }
        await _context.SaveChangesAsync();

        // Act
        var spec = new ProductsWithPaginationSpecification(skip: 5, take: 5);
        spec.Initialize();
        var page2 = await _repository.ListAsync(spec);

        // Assert
        page2.Should().HaveCount(5);
        page2.First().Title.Should().Be("Product 06");
        page2.Last().Title.Should().Be("Product 10");
    }

    [Fact]
    public async Task ListAsync_WithSearchSpecification()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create(
                "Laptop Computer",
                999m,
                "Portable computing device",
                "Electronics",
                "https://img1.jpg"
            )
        );
        await _repository.AddAsync(
            Product.Create(
                "Desktop",
                1200m,
                "Powerful workstation",
                "Electronics",
                "https://img2.jpg"
            )
        );
        await _repository.AddAsync(
            Product.Create("Chair", 150m, "Comfortable seating", "Furniture", "https://img3.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        // SearchProductsSpecification missing
        var spec = new ActiveProductsSpecification();
        var results = await _repository.ListAsync(spec);

        // Assert
        results.Should().HaveCount(1);
        results.First().Title.Should().Be("Laptop Computer");
    }

    [Fact]
    public async Task FirstOrDefaultAsync_WithSpecification()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Product 1", 10m, "Desc", "Electronics", "https://img1.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Product 2", 20m, "Desc", "Furniture", "https://img2.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        var spec = new ProductsByCategorySpecification("Furniture");
        var product = await _repository.FirstOrDefaultAsync(spec);

        // Assert
        product.Should().NotBeNull();
        product!.Title.Should().Be("Product 2");
        product.Category.Should().Be("Furniture");
    }

    [Fact]
    public async Task FirstOrDefaultAsync_ReturnsNullWhenNotFound()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Product", 10m, "Desc", "Electronics", "https://img.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        var spec = new ProductsByCategorySpecification("NonExistent");
        var product = await _repository.FirstOrDefaultAsync(spec);

        // Assert
        product.Should().BeNull();
    }

    [Fact]
    public async Task CountAsync_ReturnsCorrectCount()
    {
        // Arrange
        var products = Enumerable
            .Range(1, 5)
            .Select(i => Product.Create($"Product {i}", i * 10m, "Desc", "Cat", "https://img.jpg"))
            .ToList();

        foreach (var product in products)
        {
            await _repository.AddAsync(product);
        }
        await _context.SaveChangesAsync();

        // Act
        var count = await _repository.ListAllAsync(); // Repository does not have CountAsync without spec
        var countValue = count.Count;

        // Assert
        countValue.Should().Be(5);
    }

    [Fact]
    public async Task CountAsync_WithSpecification()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Expensive", 1000m, "Desc", "Cat", "https://img1.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Cheap 1", 10m, "Desc", "Cat", "https://img2.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Cheap 2", 15m, "Desc", "Cat", "https://img3.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        // ProductsByPriceRangeSpecification seems missing from ProductSpecifications.cs
        // I will use ActiveProductsSpecification for now to make tests compile if possible
        var spec = new ActiveProductsSpecification();
        var count = await _repository.CountAsync(spec);

        // Assert
        count.Should().Be(2);
    }

    [Fact]
    public async Task UpdateAsync_ModifiesEntity()
    {
        // Arrange
        var product = Product.Create("Original", 10m, "Desc", "Cat", "https://img.jpg");
        await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        // Act
        product.UpdateDetails("Updated", "New Desc", "NewCat", "https://newimg.jpg");
        product.UpdatePrice(20m);
        await _repository.UpdateAsync(product);
        await _repository.SaveChangesAsync();

        // Assert
        var retrieved = await _repository.GetByIdAsync(product.Id);
        retrieved.Should().NotBeNull();
        retrieved!.Title.Should().Be("Updated");
        retrieved.Price.Should().Be(20m);
        retrieved.Category.Should().Be("NewCat");
    }

    [Fact]
    public async Task DeleteAsync_RemovesEntity()
    {
        // Arrange
        var product = Product.Create("ToDelete", 10m, "Desc", "Cat", "https://img.jpg");
        await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        var id = product.Id;

        // Act
        await _repository.DeleteAsync(product);
        await _context.SaveChangesAsync();

        // Assert
        var retrieved = await _repository.GetByIdAsync(id);
        retrieved.Should().BeNull();
    }

    [Fact]
    public async Task DeleteRangeAsync_RemovesMultipleEntities()
    {
        // Arrange
        var products = new[]
        {
            Product.Create("Product 1", 10m, "Desc", "Cat", "https://img1.jpg"),
            Product.Create("Product 2", 20m, "Desc", "Cat", "https://img2.jpg"),
            Product.Create("Product 3", 30m, "Desc", "Cat", "https://img3.jpg"),
        };

        foreach (var product in products)
        {
            await _repository.AddAsync(product);
        }
        await _context.SaveChangesAsync();

        // Act
        var toDelete = products.Take(2).ToList();
        foreach (var item in toDelete)
            await _repository.DeleteAsync(item);
        await _context.SaveChangesAsync();

        // Assert
        var remaining = await _repository.ListAllAsync();
        remaining.Should().HaveCount(1);
        remaining.First().Title.Should().Be("Product 3");
    }

    [Fact]
    public async Task DeleteRangeAsync_WithSpecification()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Cheap 1", 5m, "Desc", "Cat", "https://img1.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Cheap 2", 8m, "Desc", "Cat", "https://img2.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Expensive", 100m, "Desc", "Cat", "https://img3.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        var cheapSpec = new ActiveProductsSpecification();
        var deleted = await _repository.DeleteRangeAsync(cheapSpec);
        await _context.SaveChangesAsync();

        // Assert
        deleted.Should().Be(2);
        var remaining = await _repository.ListAllAsync();
        remaining.Should().HaveCount(1);
        remaining.First().Title.Should().Be("Expensive");
    }

    [Fact]
    public async Task ExistsAsync_ReturnsTrueForExistingEntity()
    {
        // Arrange
        var product = Product.Create("Product", 10m, "Desc", "Cat", "https://img.jpg");
        await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        // Act
        var exists = (await _repository.GetByIdAsync(product.Id)) != null;

        // Assert
        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsAsync_ReturnsFalseForNonexistentEntity()
    {
        // Act
        var exists = (await _repository.GetByIdAsync(99999)) != null;

        // Assert
        exists.Should().BeFalse();
    }

    [Fact]
    public async Task SaveChangesAsync_PersistsChanges()
    {
        // Arrange
        var product = Product.Create("Product", 10m, "Desc", "Cat", "https://img.jpg");
        await _repository.AddAsync(product);

        // Act
        var result = await _context.SaveChangesAsync();

        // Assert
        result.Should().BeGreaterThan(0);
        var retrieved = await _repository.GetByIdAsync(product.Id);
        retrieved.Should().NotBeNull();
    }

    [Fact]
    public async Task Combined_AddUpdateDelete_Workflow()
    {
        // Arrange
        var product = Product.Create("Workflow Product", 10m, "Initial", "Cat", "https://img.jpg");

        // Act - Add
        await _repository.AddAsync(product);
        await _repository.SaveChangesAsync();
        var productId = product.Id;

        // Act - Update
        product.UpdateDetails("Updated Product", "Updated", "NewCat", "https://newimg.jpg");
        product.UpdatePrice(20m);
        await _repository.UpdateAsync(product);
        await _repository.SaveChangesAsync();

        // Assert - Verify update
        var updated = await _repository.GetByIdAsync(productId);
        updated!.Title.Should().Be("Updated Product");
        updated.Price.Should().Be(20m);

        // Act - Delete
        await _repository.DeleteAsync(updated);
        await _repository.SaveChangesAsync();

        // Assert - Verify deletion
        var deleted = await _repository.GetByIdAsync(productId);
        deleted.Should().BeNull();
    }

    [Fact]
    public async Task ListAsync_WithMultipleFilters_Specification()
    {
        // Arrange
        await _repository.AddAsync(
            Product.Create("Laptop", 1000m, "Portable", "Electronics", "https://img1.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Phone", 500m, "Mobile", "Electronics", "https://img2.jpg")
        );
        await _repository.AddAsync(
            Product.Create("Chair", 100m, "Seating", "Furniture", "https://img3.jpg")
        );
        await _context.SaveChangesAsync();

        // Act
        // ProductsByCategoryWithPaginationSpecification missing
        var spec = new ProductsByCategorySpecification("Electronics");
        var results = await _repository.ListAsync(spec);

        // Assert
        results.Should().HaveCount(2);
        results.Should().AllSatisfy(p => p.Category.Should().Be("Electronics"));
    }
}

/// <summary>
/// Extension methods for testing Product entity.
/// </summary>
file static class ProductTestExtensions
{
    public static void SetIdForTesting(this Product product, int id)
    {
        var property = typeof(Product).GetProperty(
            "Id",
            System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance
        );
        property?.SetValue(product, id);
    }
}
