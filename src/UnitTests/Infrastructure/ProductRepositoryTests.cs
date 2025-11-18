
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;
using ShoppingProject.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ShoppingProject.UnitTests.Infrastructure
{
    public class ProductRepositoryTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _dbContextOptions;

        public ProductRepositoryTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
        }

        [Fact]
        public async Task AddAsync_ShouldAddProductToDatabase()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var repository = new ProductRepository(context);
            var product = new Product
            {
                Title = "Test Product",
                Description = "Description",
                Price = 19.99m,
                Category = "Test Category",
                Image = "https://example.com/test.png",
                Rating = new Rating { Rate = 4.5, Count = 100 }
            };

            // Act
            var result = await repository.AddAsync(product);

            // Assert
            Assert.NotEqual(0, result.Id);
            var savedProduct = await context.Products.FindAsync(result.Id);
            Assert.NotNull(savedProduct);
            Assert.Equal(product.Title, savedProduct.Title);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllProducts()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var repository = new ProductRepository(context);

            await context.Products.AddRangeAsync(
                new Product 
                { 
                    Title = "Test 1", 
                    Description = "Description 1", 
                    Price = 19.99m,
                    Category = "Category 1",
                    Image = "https://example.com/test1.png",
                    Rating = new Rating { Rate = 4.0, Count = 50 }
                },
                new Product 
                { 
                    Title = "Test 2", 
                    Description = "Description 2", 
                    Price = 29.99m,
                    Category = "Category 2",
                    Image = "https://example.com/test2.png",
                    Rating = new Rating { Rate = 4.5, Count = 75 }
                }
            );
            await context.SaveChangesAsync();

            // Act
            var results = await repository.GetAllAsync();

            // Assert
            Assert.Equal(2, results.Count());
        }
    }
}
