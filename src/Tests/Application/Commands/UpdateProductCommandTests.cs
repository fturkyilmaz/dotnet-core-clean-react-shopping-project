using Ardalis.GuardClauses;
using Bogus;
using FluentAssertions;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Products.Commands.UpdateProduct;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.UnitTests.Application.Commands;

public class UpdateProductCommandTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly UpdateProductCommandHandler _handler;
    private readonly Faker _faker;

    public UpdateProductCommandTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new UpdateProductCommandHandler(_mockContext.Object);
        _faker = new Faker();
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldUpdateProduct()
    {
        // Arrange
        var existingProduct = new Product
        {
            Id = 1,
            Title = "Old Title",
            Description = "Old Description",
            Price = 10m,
            Category = "old",
            Image = "old.jpg",
        };

        var products = new List<Product> { existingProduct }.AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);
        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var command = new UpdateProductCommand
        {
            Id = 1,
            Title = "New Title",
            Description = "New Description",
            Price = 20m,
            Category = "new",
            Image = "new.jpg",
        };

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Title.Should().Be("New Title");
        existingProduct.Description.Should().Be("New Description");
        existingProduct.Price.Should().Be(20m);
        existingProduct.Category.Should().Be("new");
        existingProduct.Image.Should().Be("new.jpg");

        _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistentProduct_ShouldThrowNotFoundException()
    {
        // Arrange
        var products = new List<Product>().AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);

        var command = new UpdateProductCommand
        {
            Id = 999,
            Title = "Test",
            Price = 10m,
        };

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(command, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Handle_NullValues_ShouldKeepExistingValues()
    {
        // Arrange
        var existingProduct = new Product
        {
            Id = 1,
            Title = "Original Title",
            Description = "Original Description",
            Price = 15m,
            Category = "original",
            Image = "original.jpg",
        };

        var products = new List<Product> { existingProduct }.AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);
        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var command = new UpdateProductCommand
        {
            Id = 1,
            Title = null,
            Description = null,
            Price = 25m,
            Category = null,
            Image = null,
        };

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Title.Should().Be("Original Title");
        existingProduct.Description.Should().Be("Original Description");
        existingProduct.Price.Should().Be(25m);
        existingProduct.Category.Should().Be("original");
        existingProduct.Image.Should().Be("original.jpg");
    }
}
