
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using ShoppingProject.Application.Services;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;
using Moq;

namespace ShoppingProject.UnitTests.Application
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockRepository;
        private readonly IProductService _productService;

        public ProductServiceTests()
        {
            _mockRepository = new Mock<IProductRepository>();
            _productService = new ProductService(_mockRepository.Object);
        }

        [Fact]
        public async Task GetByIdAsync_ExistingProduct_ShouldReturnProduct()
        {
            // Arrange
            var product = new Product
            {
                Title = "Test",
                Description = "Description",
                Price = 19.99m,
                Category = "Test Category",
                Image = "https://example.com/test.png",
                Rating = new Rating { Rate = 4.5, Count = 100 }
            };
            _mockRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(product);

            // Act
            var result = await _productService.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(product.Title, result.Title);
            Assert.Equal(product.Price, result.Price);
        }

        [Fact]
        public async Task CreateAsync_ValidProduct_ShouldSucceed()
        {
            // Arrange
            var createDto = new CreateProductDto
            {
                Title = "Test",
                Description = "Description",
                Price = 19.99m,
                Category = "Test Category",
                Image = "https://example.com/test.png",
                Rating = new RatingDto { Rate = 4.5, Count = 100 }
            };
            _mockRepository.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .ReturnsAsync((Product p) => p);

            // Act
            var result = await _productService.CreateAsync(createDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createDto.Title, result.Title);
            Assert.Equal(createDto.Price, result.Price);
        }
    }
}
