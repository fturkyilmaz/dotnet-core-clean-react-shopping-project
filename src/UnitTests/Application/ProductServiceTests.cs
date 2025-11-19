
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Interfaces;
using ShoppingProject.Application.Services;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;
using AutoMapper;
using Moq;

namespace ShoppingProject.UnitTests.Application
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly IProductService _productService;

        public ProductServiceTests()
        {
            _mockRepository = new Mock<IProductRepository>();
            _mockMapper = new Mock<IMapper>();
            _productService = new ProductService(_mockRepository.Object, _mockMapper.Object);
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
            var productDto = new ProductDto(product.Id, product.Title, product.Description, product.Price, product.Category, product.Image, new RatingDto { Rate = 4.5, Count = 100 });

            _mockRepository.Setup(repo => repo.GetAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Product, bool>>>()))
                .ReturnsAsync(product);
            _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

            // Act
            var result = await _productService.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(product.Title, result.Data.Title);
            Assert.Equal(product.Price, result.Data.Price);
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
            var product = new Product { Title = "Test", Price = 19.99m };
            var productDto = new ProductDto(0, "Test", "Description", 19.99m, "Test Category", "https://example.com/test.png", new RatingDto { Rate = 4.5, Count = 100 });

            _mockMapper.Setup(m => m.Map<Product>(createDto)).Returns(product);
            _mockRepository.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                .ReturnsAsync(product);
            _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

            // Act
            var result = await _productService.CreateAsync(createDto);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(createDto.Title, result.Data.Title);
            Assert.Equal(createDto.Price, result.Data.Price);
        }
    }
}
