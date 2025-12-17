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
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly CreateProductCommandHandler _handler;
    private readonly Faker _faker;

    public CreateProductCommandTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new CreateProductCommandHandler(_mockContext.Object);
        _faker = new Faker();
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
            _faker.Image.PicsumUrl() // geçerli URL
        );

        Product? capturedProduct = null;
        _mockContext
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var result = await _handler.Handle(command, CancellationToken.None);

        capturedProduct.Should().NotBeNull();
        capturedProduct!.Title.Should().Be(command.Title);
        capturedProduct.Description.Should().Be(command.Description);
        capturedProduct.Price.Should().Be(command.Price);
        capturedProduct.Category.Should().Be(command.Category);
        capturedProduct.Image.Should().Be(command.Image);

        _mockContext.Verify(x => x.Add(It.IsAny<Product>()), Times.Once);
        _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

        Assert.Equal(capturedProduct.Id, result);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldRaiseDomainEvent()
    {
        var command = new CreateProductCommand(
            "Test Product",
            29.99m,
            "Test Description",
            "electronics",
            _faker.Image.PicsumUrl() // geçerli URL
        );

        Product? capturedProduct = null;
        _mockContext
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        await _handler.Handle(command, CancellationToken.None);

        capturedProduct.Should().NotBeNull();
        capturedProduct!.DomainEvents.Should().ContainSingle();
        capturedProduct.DomainEvents.First().Should().BeOfType<ProductCreatedEvent>();

        var domainEvent = capturedProduct.DomainEvents.First() as ProductCreatedEvent;
        domainEvent!.Item.Should().Be(capturedProduct);
    }

    [Fact]
    public async Task Handle_NullValues_ShouldUseEmptyStrings()
    {
        var command = new CreateProductCommand(
            null,
            10m,
            null,
            null,
            null
        );

        Product? capturedProduct = null;
        _mockContext
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        await _handler.Handle(command, CancellationToken.None);

        capturedProduct.Should().NotBeNull();
        capturedProduct!.Title.Should().BeEmpty();
        capturedProduct.Description.Should().BeEmpty();
        capturedProduct.Category.Should().BeEmpty();
        capturedProduct.Image.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldInitializeRating()
    {
        var command = new CreateProductCommand(
            "Test",
            10m,
            "Test",
            "test",
            _faker.Image.PicsumUrl() // geçerli URL
        );

        Product? capturedProduct = null;
        _mockContext
            .Setup(x => x.Add(It.IsAny<Product>()))
            .Callback<Product>(p => capturedProduct = p);

        _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        await _handler.Handle(command, CancellationToken.None);

        capturedProduct.Should().NotBeNull();
        capturedProduct!.Rating.Should().NotBeNull();
        capturedProduct.Rating.Rate.Should().Be(0.0);
        capturedProduct.Rating.Count.Should().Be(0);
    }
}
