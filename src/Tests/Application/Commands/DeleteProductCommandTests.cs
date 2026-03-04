using Ardalis.GuardClauses;
using FluentAssertions;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Products.Commands.DeleteProduct;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.UnitTests.Application.Commands;

public class DeleteProductCommandTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRepository<Product>> _mockProductRepository;
    private readonly DeleteProductCommandHandler _handler;

    public DeleteProductCommandTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductRepository = new Mock<IRepository<Product>>();

        _mockUnitOfWork
            .Setup(x => x.Repository<Product>())
            .Returns(_mockProductRepository.Object);

        // Setup ExecuteInTransactionAsync to execute the lambda immediately
        _mockUnitOfWork
            .Setup(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task>>(), It.IsAny<CancellationToken>()))
            .Returns<Func<Task>, CancellationToken>((func, _) => func());

        _handler = new DeleteProductCommandHandler(_mockUnitOfWork.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldSoftDeleteProduct()
    {
        // Arrange
        var existingProduct = Product.Create("Test Product", 10m, "Test", "test", "test.jpg");
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        _mockProductRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var command = new DeleteProductCommand(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Status.Should().Be(EntityStatus.Deleted);
        _mockProductRepository.Verify(x => x.Update(It.IsAny<Product>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldRaiseDomainEvent()
    {
        // Arrange
        var existingProduct = Product.Create("Test Product", 10m, "Test", "test", "test.jpg");
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        _mockProductRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var command = new DeleteProductCommand(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.DomainEvents.Should().Contain(x => x is ProductStatusChangedEvent);
        existingProduct.DomainEvents.First().Should().BeOfType<ProductStatusChangedEvent>();

        var domainEvent = existingProduct.DomainEvents.First() as ProductStatusChangedEvent;
        domainEvent!.ProductId.Should().Be(existingProduct.Id);
        domainEvent.Status.Should().Be(EntityStatus.Deleted);
    }

    [Fact]
    public async Task Handle_NonExistentProduct_ShouldThrowNotFoundException()
    {
        // Arrange
        _mockProductRepository
            .Setup(x => x.GetByIdAsync(999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var command = new DeleteProductCommand(999);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(command, CancellationToken.None)
        );
    }
}
