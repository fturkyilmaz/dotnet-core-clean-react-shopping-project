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
        var existingProduct = Product.Create(
            "Old Title",
            10m,
            "Old Description",
            "old",
            _faker.Image.PicsumUrl() // geçerli URL
        );

        // Id setlemek için reflection (test amaçlı)
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        var products = new List<Product> { existingProduct }.AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);
        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var command = new UpdateProductCommand(
            1,
            "New Title",
            20m,
            "New Description",
            "new",
            _faker.Image.PicsumUrl() // geçerli URL
        );

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Title.Should().Be("New Title");
        existingProduct.Description.Should().Be("New Description");
        existingProduct.Price.Should().Be(20m);
        existingProduct.Category.Should().Be("new");
        existingProduct.Image.Should().Be(command.Image);

        _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistentProduct_ShouldThrowNotFoundException()
    {
        // Arrange
        var products = new List<Product>().AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);

        var command = new UpdateProductCommand(999, "Test", 10m, null, null, null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(command, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Handle_NullValues_ShouldKeepExistingValues()
    {
        // Arrange
        var existingProduct = Product.Create(
            "Original Title",
            15m,
            "Original Description",
            "original",
            _faker.Image.PicsumUrl() // geçerli URL
        );
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        var products = new List<Product> { existingProduct }.AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);
        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var command = new UpdateProductCommand(1, null, 25m, null, null, null);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Title.Should().Be("Original Title");
        existingProduct.Description.Should().Be("Original Description");
        existingProduct.Price.Should().Be(25m);
        existingProduct.Category.Should().Be("original");
        existingProduct.Image.Should().NotBeNullOrEmpty(); // Faker URL korunur
    }
}
