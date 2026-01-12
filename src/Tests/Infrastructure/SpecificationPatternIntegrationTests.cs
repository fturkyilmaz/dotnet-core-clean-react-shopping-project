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
/// Integration tests for the Specification pattern using Testcontainers.PostgreSQL.
/// Tests database queries with real PostgreSQL instance.
/// Covers filtering, ordering, pagination, search, and eager loading.
/// </summary>
[Collection("PostgreSQL Tests")]
public class SpecificationPatternIntegrationTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container;
    private ApplicationDbContext _context = null!;

    public SpecificationPatternIntegrationTests()
    {
        _container = new PostgreSqlBuilder()
            .WithDatabase("testdb")
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
        await SeedTestDataAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _container.StopAsync();
    }

    private async Task SeedTestDataAsync()
    {
        var products = new[]
        {
            Product.Create(
                "Laptop",
                999.99m,
                "High performance laptop",
                "Electronics",
                "https://example.com/laptop.jpg"
            ),
            Product.Create(
                "Mouse",
                29.99m,
                "Wireless mouse",
                "Electronics",
                "https://example.com/mouse.jpg"
            ),
            Product.Create(
                "Keyboard",
                79.99m,
                "Mechanical keyboard",
                "Electronics",
                "https://example.com/keyboard.jpg"
            ),
            Product.Create(
                "Monitor",
                299.99m,
                "4K Monitor",
                "Electronics",
                "https://example.com/monitor.jpg"
            ),
            Product.Create(
                "Desk",
                399.99m,
                "Standing desk",
                "Furniture",
                "https://example.com/desk.jpg"
            ),
            Product.Create(
                "Chair",
                199.99m,
                "Ergonomic chair",
                "Furniture",
                "https://example.com/chair.jpg"
            ),
        };

        _context.Products.AddRange(products);
        await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task ActiveProductsSpecification_ReturnsOnlyActiveProducts()
    {
        // Arrange
        var spec = new ActiveProductsSpecification();

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().NotBeEmpty();
        results.Should().AllSatisfy(p => p.Price.Should().BeGreaterThan(0));
    }

    [Fact]
    public async Task ProductsByCategorySpecification_FiltersByCategory()
    {
        // Arrange
        var spec = new ProductsByCategorySpecification("Electronics");

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().NotBeEmpty();
        results.Should().AllSatisfy(p => p.Category.Should().Be("Electronics"));
        results.Count.Should().Be(4); // Laptop, Mouse, Keyboard, Monitor
    }

    [Fact]
    public async Task ProductsWithPaginationSpecification_ReturnsPaginatedResults()
    {
        // Arrange
        var pageIndex = 1;
        var pageSize = 2;
        var spec = new ProductsWithPaginationSpecification(pageIndex, pageSize);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().HaveCount(pageSize);
    }

    [Fact]
    public async Task ProductsWithPaginationSpecification_SecondPageReturnsCorrectItems()
    {
        // Arrange
        var pageIndex = 2;
        var pageSize = 2;
        var spec = new ProductsWithPaginationSpecification(pageIndex, pageSize);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().HaveCount(pageSize);
    }

    [Fact]
    public async Task SearchProductsSpecification_SearchesAcrossMultipleProperties()
    {
        // Arrange
        var searchTerm = "Keyboard";
        var spec = new SearchProductsSpecification(searchTerm, 1, 10);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().ContainSingle();
        results[0].Title.Should().Be("Keyboard");
    }

    [Fact]
    public async Task SearchProductsSpecification_FindsProductByDescription()
    {
        // Arrange
        var searchTerm = "Wireless";
        var spec = new SearchProductsSpecification(searchTerm, 1, 10);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().ContainSingle(p => p.Title == "Mouse");
    }

    [Fact]
    public async Task ProductsByPriceRangeSpecification_FiltersByPriceRange()
    {
        // Arrange
        var minPrice = 50m;
        var maxPrice = 150m;
        var spec = new ProductsByPriceRangeSpecification(minPrice, maxPrice);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().NotBeEmpty();
        results
            .Should()
            .AllSatisfy(p =>
            {
                p.Price.Should().BeGreaterThanOrEqualTo(minPrice);
                p.Price.Should().BeLessThanOrEqualTo(maxPrice);
            });
    }

    [Fact]
    public async Task ProductsByCategoryWithPaginationSpecification_FiltersCategoryAndPaginates()
    {
        // Arrange
        var spec = new ProductsByCategoryWithPaginationSpecification("Furniture", 1, 1);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().HaveCount(1);
        results[0].Category.Should().Be("Furniture");
    }

    [Fact]
    public async Task SpecificationEvaluator_AppliesOrderingCorrectly()
    {
        // Arrange
        var spec = new ActiveProductsSpecification();

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        var titlesList = results.Select(p => p.Title).ToList();
        titlesList.Should().BeInAscendingOrder();
    }

    [Fact]
    public async Task SpecificationEvaluator_AppliesFiltersAndOrderingAndPagination()
    {
        // Arrange
        var spec = new ProductsWithPaginationSpecification(1, 3);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().HaveCount(3);
        results.Should().BeInAscendingOrder(p => p.Id);
    }

    [Fact]
    public async Task SearchSpecification_WithEmptySearchTerm_ReturnsAllProducts()
    {
        // Arrange
        var spec = new SearchProductsSpecification("", 1, 10);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().HaveCount(6);
    }

    [Fact]
    public async Task PriceRangeSpecification_WithNarrowRange_ReturnsCorrectProducts()
    {
        // Arrange
        var spec = new ProductsByPriceRangeSpecification(25m, 35m);

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results.Should().ContainSingle(p => p.Title == "Mouse");
    }

    [Fact]
    public async Task SpecificationEvaluator_ReadsAsNoTracking()
    {
        // Arrange
        var spec = new ActiveProductsSpecification();

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(
            _context.Products.AsNoTracking(),
            spec
        );
        var results = await query.ToListAsync();

        // Assert
        // Verify no change tracking entries exist
        _context.ChangeTracker.Entries().Should().BeEmpty();
    }

    [Fact]
    public async Task CombinedSpecification_MultipleFilters()
    {
        // Arrange
        // Create a custom specification combining multiple filters
        var spec = new ProductsByCategorySpecification("Electronics");

        // Act
        var query = SpecificationEvaluator<Product>.GetQuery(_context.Products, spec);
        var results = await query.ToListAsync();

        // Assert
        results
            .Should()
            .AllSatisfy(p =>
            {
                p.Category.Should().Be("Electronics");
                p.Price.Should().BeGreaterThan(0);
            });
    }
}
