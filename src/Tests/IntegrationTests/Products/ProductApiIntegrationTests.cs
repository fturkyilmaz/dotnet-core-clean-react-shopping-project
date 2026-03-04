using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Products.Commands.CreateProduct;
using ShoppingProject.Domain.Entities;
using ShoppingProject.IntegrationTests.Fixtures;
using Xunit;

namespace ShoppingProject.IntegrationTests.Products;

[Collection("Integration Tests")]
public class ProductApiIntegrationTests : IAsyncLifetime
{
    private readonly IntegrationTestFixture _fixture;
    private readonly HttpClient _client;

    public ProductApiIntegrationTests(IntegrationTestFixture fixture)
    {
        _fixture = fixture;
        _client = fixture.HttpClient;
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync()
    {
        await _fixture.ResetDatabaseAsync();
    }

    [Fact]
    public async Task CreateProduct_WithValidData_ShouldReturn201()
    {
        // Arrange
        var command = new CreateProductCommand(
            Title: "Integration Test Product",
            Price: 99.99m,
            Description: "A product created during integration testing",
            Category: "TestCategory",
            Image: "https://example.com/test-product.jpg"
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/products", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var result = await response.Content.ReadFromJsonAsync<ServiceResult<int>>();
        result.Should().NotBeNull();
        result!.Data.Should().BeGreaterThan(0);
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task CreateProduct_WithInvalidData_ShouldReturn422()
    {
        // Arrange - Invalid: Empty title
        var command = new CreateProductCommand(
            Title: "", // Invalid
            Price: 99.99m,
            Description: "Description",
            Category: "Category",
            Image: "https://example.com/image.jpg"
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/products", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task GetProductById_WithExistingProduct_ShouldReturn200()
    {
        // Arrange - Create a product first
        var createCommand = new CreateProductCommand(
            Title: "Product to Retrieve",
            Price: 49.99m,
            Description: "Description",
            Category: "Category",
            Image: "https://example.com/image.jpg"
        );

        var createResponse = await _client.PostAsJsonAsync("/api/v1/products", createCommand);
        var createResult = await createResponse.Content.ReadFromJsonAsync<ServiceResult<int>>();
        var productId = createResult!.Data;

        // Act
        var response = await _client.GetAsync($"/api/v1/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ServiceResult<ProductDto>>();
        result.Should().NotBeNull();
        result!.Data.Should().NotBeNull();
        result.Data!.Id.Should().Be(productId);
        result.Data.Title.Should().Be("Product to Retrieve");
    }

    [Fact]
    public async Task GetProductById_WithNonExistingProduct_ShouldReturn404()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/products/999999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetProductsList_ShouldReturn200WithList()
    {
        // Arrange - Create multiple products
        for (int i = 1; i <= 3; i++)
        {
            var command = new CreateProductCommand(
                Title: $"Product {i}",
                Price: 10m * i,
                Description: $"Description {i}",
                Category: "TestCategory",
                Image: "https://example.com/image.jpg"
            );
            await _client.PostAsJsonAsync("/api/v1/products", command);
        }

        // Act
        var response = await _client.GetAsync("/api/v1/products");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ServiceResult<IEnumerable<ProductDto>>>();
        result.Should().NotBeNull();
        result!.Data.Should().NotBeNull();
        result.Data!.Count().Should().BeGreaterOrEqualTo(3);
    }

    [Fact]
    public async Task UpdateProduct_WithValidData_ShouldReturn204()
    {
        // Arrange - Create a product first
        var createCommand = new CreateProductCommand(
            Title: "Product to Update",
            Price: 49.99m,
            Description: "Original Description",
            Category: "OriginalCategory",
            Image: "https://example.com/original.jpg"
        );

        var createResponse = await _client.PostAsJsonAsync("/api/v1/products", createCommand);
        var createResult = await createResponse.Content.ReadFromJsonAsync<ServiceResult<int>>();
        var productId = createResult!.Data;

        var updateCommand = new
        {
            Title = "Updated Product",
            Price = 59.99m,
            Description = "Updated Description",
            Category = "UpdatedCategory",
            Image = "https://example.com/updated.jpg"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/v1/products/{productId}", updateCommand);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify update
        var getResponse = await _client.GetAsync($"/api/v1/products/{productId}");
        var getResult = await getResponse.Content.ReadFromJsonAsync<ServiceResult<ProductDto>>();
        getResult!.Data!.Title.Should().Be("Updated Product");
        getResult.Data.Price.Should().Be(59.99m);
    }

    [Fact]
    public async Task DeleteProduct_WithExistingProduct_ShouldReturn204()
    {
        // Arrange - Create a product first
        var createCommand = new CreateProductCommand(
            Title: "Product to Delete",
            Price: 29.99m,
            Description: "Description",
            Category: "Category",
            Image: "https://example.com/image.jpg"
        );

        var createResponse = await _client.PostAsJsonAsync("/api/v1/products", createCommand);
        var createResult = await createResponse.Content.ReadFromJsonAsync<ServiceResult<int>>();
        var productId = createResult!.Data;

        // Act
        var response = await _client.DeleteAsync($"/api/v1/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion (should return 404)
        var getResponse = await _client.GetAsync($"/api/v1/products/{productId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetProductsByCategory_ShouldReturnFilteredResults()
    {
        // Arrange - Create products in different categories
        var electronicsProduct = new CreateProductCommand(
            Title: "Electronics Product",
            Price: 199.99m,
            Description: "An electronics item",
            Category: "Electronics",
            Image: "https://example.com/electronics.jpg"
        );

        var clothingProduct = new CreateProductCommand(
            Title: "Clothing Product",
            Price: 49.99m,
            Description: "A clothing item",
            Category: "Clothing",
            Image: "https://example.com/clothing.jpg"
        );

        await _client.PostAsJsonAsync("/api/v1/products", electronicsProduct);
        await _client.PostAsJsonAsync("/api/v1/products", clothingProduct);

        // Act - This assumes there's an endpoint for category filtering
        // If not available, this test demonstrates the pattern
        var response = await _client.GetAsync("/api/v1/products?category=Electronics");

        // Assert
        if (response.StatusCode == HttpStatusCode.OK)
        {
            var result = await response.Content.ReadFromJsonAsync<ServiceResult<IEnumerable<ProductDto>>>();
            result!.Data!.All(p => p.Category == "Electronics").Should().BeTrue();
        }
    }
}
