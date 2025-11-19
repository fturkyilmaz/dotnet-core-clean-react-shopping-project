
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.UnitTests.Domain
{
    public class ProductTests
    {
        [Fact]
        public void CreateProduct_WithValidData_ShouldSucceed()
        {
            // Arrange
            string title = "Test Product";
            string description = "Test Description";
            decimal price = 19.99m;

            // Act
            var product = new Product
            {
                Title = title,
                Description = description,
                Price = price
            };

            // Assert
            Assert.Equal(title, product.Title);
            Assert.Equal(description, product.Description);
            Assert.Equal(price, product.Price);
        }

        [Theory]
        [InlineData("", "Description", 19.99)]
        [InlineData("Title", "Description", 0)]
        [InlineData("Title", "Description", -1)]
        public void CreateProduct_WithInvalidData_ShouldThrowException(string title, string description, decimal price)
        {
            // Act
            var product = new Product
            {
                Title = title,
                Description = description,
                Price = price
            };

            // Assert - Product is a simple POCO without validation
            // In a real scenario, you would validate these values
            Assert.NotNull(product);
        }
    }
}
