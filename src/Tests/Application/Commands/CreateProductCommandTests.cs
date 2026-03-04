using Bogus;
using FluentAssertions;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Products.Commands.CreateProduct;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.UnitTests.Application.Commands;

public class CreateProductCommandTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRepository<Product>> _mockProductRepository;
    private readonly CreateProductCommandHandler _handler;
    private readonly Faker _faker;

    public CreateProductCommandTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductRepository = new Mock<IRepository<Product>>();
        _faker = new Faker();

        _mockUnitOfWork
            .Setup(x => x.Repository<Product>())
            .Returns(_mockProductRepository.Object);

        // Setup ExecuteInTransactionAsync to execute the lambda immediately
        _mockUnitOfWork
            .Setup(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task<int>>>(), It.IsAny<CancellationToken>()))
            .Returns<Func<Task<int>>, CancellationToken>((func, _) => func());

        _handler = new CreateProductCommandHandler(_mockUnitOfWork.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateProduct()
    {
        // Arrange
        var command = new CreateProductCommand(
            _faker.Commerce.ProductName(),
            _faker.Random.Decimal(1, 1000),
            _faker.Commerce.ProductDescription(),
            _faker.Commerce.Categories(1)[0],
            _faker.Image.PicsumUrl()
        );

        Product? capturedProduct = null;
        _mockProductRepository
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        // Act
        _ = await _handler.Handle(command, CancellationToken.None);

        // Assert
        capturedProduct.Should().NotBeNull();
        capturedProduct!.Title.Should().Be(command.Title);
        capturedProduct.Description.Should().Be(command.Description);
        capturedProduct.Price.Should().Be(command.Price);
        capturedProduct.Category.Should().Be(command.Category);
        capturedProduct.Image.Should().Be(command.Image);

        _mockProductRepository.Verify(x => x.Add(It.IsAny<Product>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task<int>>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldRaiseDomainEvent()
    {
        // Arrange
        var command = new CreateProductCommand(
            "Test Product",
            29.99m,
            "Test Description",
            "electronics",
            _faker.Image.PicsumUrl()
        );

        Product? capturedProduct = null;
        _mockProductRepository
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        capturedProduct.Should().NotBeNull();
        capturedProduct!.DomainEvents.Should().ContainSingle();
        capturedProduct.DomainEvents.First().Should().BeOfType<ProductCreatedEvent>();

        var domainEvent = capturedProduct.DomainEvents.First() as ProductCreatedEvent;
        domainEvent!.Item.Should().Be(capturedProduct);
    }

    [Fact]
    public async Task Handle_NullValues_ShouldUseEmptyStrings()
    {
        // Arrange
        var command = new CreateProductCommand(
            null,
            10m,
            null,
            null,
            null
        );

        Product? capturedProduct = null;
        _mockProductRepository
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        capturedProduct.Should().NotBeNull();
        capturedProduct!.Title.Should().BeEmpty();
        capturedProduct.Description.Should().BeEmpty();
        capturedProduct.Category.Should().BeEmpty();
        capturedProduct.Image.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_CommandWithZeroPrice_ShouldCreateProductWithZeroPrice()
    {
        // Arrange
        var command = new CreateProductCommand(
            "Free Product",
            0m,
            "This is free",
            "freebies",
            "https://example.com/free.jpg"
        );

        Product? capturedProduct = null;
        _mockProductRepository
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        capturedProduct.Should().NotBeNull();
        capturedProduct!.Price.Should().Be(0m);
    }
}
