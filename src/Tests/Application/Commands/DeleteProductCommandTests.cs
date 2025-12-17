using Ardalis.GuardClauses;
using FluentAssertions;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Products.Commands.DeleteProduct;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.UnitTests.Application.Commands;

public class DeleteProductCommandTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly DeleteProductCommandHandler _handler;

    public DeleteProductCommandTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new DeleteProductCommandHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldDeleteProduct()
    {
        // Arrange
        var existingProduct = Product.Create("Test Product", 10m, "Test", "test", "test.jpg");
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        var products = new List<Product> { existingProduct }.AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);
        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var command = new DeleteProductCommand(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _mockContext.Verify(x => x.Remove(existingProduct), Times.Once);
        _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldRaiseDomainEvent()
    {
        // Arrange
        var existingProduct = Product.Create("Test Product", 10m, "Test", "test", "test.jpg");
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        var products = new List<Product> { existingProduct }.AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);
        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var command = new DeleteProductCommand(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.DomainEvents.Should().Contain(x => x is ProductDeletedEvent);

        existingProduct.DomainEvents.First().Should().BeOfType<ProductDeletedEvent>();

        var domainEvent = existingProduct.DomainEvents.First() as ProductDeletedEvent;
        domainEvent!.Item.Should().Be(existingProduct);
    }

    [Fact]
    public async Task Handle_NonExistentProduct_ShouldThrowNotFoundException()
    {
        // Arrange
        var products = new List<Product>().AsQueryable();
        _mockContext.Setup(x => x.Products).Returns(products);

        var command = new DeleteProductCommand(999);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(command, CancellationToken.None)
        );

        _mockContext.Verify(x => x.Remove(It.IsAny<Product>()), Times.Never);
    }
}
