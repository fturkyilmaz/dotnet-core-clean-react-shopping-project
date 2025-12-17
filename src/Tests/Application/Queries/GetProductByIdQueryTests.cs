using Ardalis.GuardClauses;
using AutoMapper;
using Bogus;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Products.Queries.GetProductById;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.UnitTests.Application.Queries;

public class GetProductByIdQueryTests
{
    private readonly Mock<IProductRepository> _mockProductRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<ICacheService> _mockCacheService;
    private readonly GetProductByIdQueryHandler _handler;

    public GetProductByIdQueryTests()
    {
        _mockProductRepository = new Mock<IProductRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockCacheService = new Mock<ICacheService>();
        _handler = new GetProductByIdQueryHandler(
            _mockProductRepository.Object,
            _mockMapper.Object,
            _mockCacheService.Object
        );
    }

    [Fact]
    public async Task Handle_ExistingProduct_ShouldReturnProductFromCache()
    {
        // Arrange
        var productId = 1;
        var query = new GetProductByIdQuery(productId);
        var expectedDto = new ProductDto(
            Id: productId,
            Title: "Test Product",
            Description: "Test Description",
            Price: 29.99m,
            Category: "electronics",
            Image: "test.jpg",
            Rating: null
        );

        _mockCacheService
            .Setup(x =>
                x.GetOrSetAsync(
                    $"product-{productId}",
                    It.IsAny<Func<Task<ProductDto>>>(),
                    It.IsAny<TimeSpan>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(productId);
        result.Title.Should().Be("Test Product");

        _mockCacheService.Verify(
            x =>
                x.GetOrSetAsync(
                    $"product-{productId}",
                    It.IsAny<Func<Task<ProductDto>>>(),
                    TimeSpan.FromMinutes(10),
                    It.IsAny<CancellationToken>()
                ),
            Times.Once
        );
    }

    [Fact]
    public async Task Handle_NonExistentProduct_ShouldThrowNotFoundException()
    {
        // Arrange
        var productId = 999;
        var query = new GetProductByIdQuery(productId);

        _mockCacheService
            .Setup(x =>
                x.GetOrSetAsync(
                    $"product-{productId}",
                    It.IsAny<Func<Task<ProductDto>>>(),
                    It.IsAny<TimeSpan>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ThrowsAsync(new NotFoundException("Product", productId.ToString()));

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(query, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Handle_ValidQuery_ShouldUseCacheKeyWithProductId()
    {
        // Arrange
        var productId = 42;
        var query = new GetProductByIdQuery(productId);
        var expectedKey = $"product-{productId}";

        var productDto = new ProductDto(
            Id: productId,
            Title: "Test",
            Description: "Test",
            Price: 10m,
            Category: "test",
            Image: "test.jpg",
            Rating: null
        );

        _mockCacheService
            .Setup(x =>
                x.GetOrSetAsync(
                    expectedKey,
                    It.IsAny<Func<Task<ProductDto>>>(),
                    It.IsAny<TimeSpan>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(productDto);

        // Act
        await _handler.Handle(query, CancellationToken.None);

        // Assert
        _mockCacheService.Verify(
            x =>
                x.GetOrSetAsync(
                    expectedKey,
                    It.IsAny<Func<Task<ProductDto>>>(),
                    It.IsAny<TimeSpan>(),
                    It.IsAny<CancellationToken>()
                ),
            Times.Once
        );
    }

    [Fact]
    public async Task Handle_ValidQuery_ShouldUse10MinuteCacheExpiration()
    {
        // Arrange
        var productId = 1;
        var query = new GetProductByIdQuery(productId);
        var productDto = new ProductDto(
            Id: productId,
            Title: "Test",
            Description: "Test",
            Price: 10m,
            Category: "test",
            Image: "test.jpg",
            Rating: null
        );

        _mockCacheService
            .Setup(x =>
                x.GetOrSetAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<ProductDto>>>(),
                    TimeSpan.FromMinutes(10),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(productDto);

        // Act
        await _handler.Handle(query, CancellationToken.None);

        // Assert
        _mockCacheService.Verify(
            x =>
                x.GetOrSetAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<ProductDto>>>(),
                    TimeSpan.FromMinutes(10),
                    It.IsAny<CancellationToken>()
                ),
            Times.Once
        );
    }
}
