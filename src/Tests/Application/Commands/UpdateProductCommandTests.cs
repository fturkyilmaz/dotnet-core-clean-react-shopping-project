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
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRepository<Product>> _mockProductRepository;
    private readonly UpdateProductCommandHandler _handler;
    private readonly Faker _faker;

    public UpdateProductCommandTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductRepository = new Mock<IRepository<Product>>();
        _faker = new Faker();

        _mockUnitOfWork
            .Setup(x => x.Repository<Product>())
            .Returns(_mockProductRepository.Object);

        // Setup ExecuteInTransactionAsync to execute the lambda immediately
        _mockUnitOfWork
            .Setup(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task>>(), It.IsAny<CancellationToken>()))
            .Returns<Func<Task>, CancellationToken>((func, _) => func());

        _handler = new UpdateProductCommandHandler(_mockUnitOfWork.Object);
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
            _faker.Image.PicsumUrl()
        );
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        _mockProductRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var command = new UpdateProductCommand(
            1,
            "New Title",
            20m,
            "New Description",
            "new",
            _faker.Image.PicsumUrl()
        );

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Title.Should().Be("New Title");
        existingProduct.Description.Should().Be("New Description");
        existingProduct.Price.Should().Be(20m);
        existingProduct.Category.Should().Be("new");
        existingProduct.Image.Should().Be(command.Image);

        _mockProductRepository.Verify(x => x.Update(It.IsAny<Product>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistentProduct_ShouldThrowNotFoundException()
    {
        // Arrange
        _mockProductRepository
            .Setup(x => x.GetByIdAsync(999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

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
            _faker.Image.PicsumUrl()
        );
        typeof(Product).GetProperty(nameof(Product.Id))!.SetValue(existingProduct, 1);

        _mockProductRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var command = new UpdateProductCommand(1, null, 25m, null, null, null);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingProduct.Title.Should().Be("Original Title");
        existingProduct.Description.Should().Be("Original Description");
        existingProduct.Price.Should().Be(25m);
        existingProduct.Category.Should().Be("original");
    }
}
