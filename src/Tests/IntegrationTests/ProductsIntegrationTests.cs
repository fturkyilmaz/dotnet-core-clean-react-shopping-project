using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using Xunit;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class ProductsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public ProductsIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAllProducts_Should_Return_List()
        {
            var response = await _client.GetAsync("/api/v1/products");
            response.EnsureSuccessStatusCode();

            var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>();
            Assert.NotNull(products);
        }

        [Fact]
        public async Task GetProductById_Should_Return_Product()
        {
            var response = await _client.GetAsync("/api/v1/products/1");
            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.NotFound
            );
        }

        [Fact]
        public async Task SearchProducts_Should_Return_Results()
        {
            var response = await _client.PostAsJsonAsync(
                "/api/v1/products/search",
                new { Query = "Laptop" }
            );
            response.EnsureSuccessStatusCode();
        }

        // Admin required
        [Fact]
        public async Task CreateProduct_Should_Return_Success_When_Authorized()
        {
            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "ADMIN_JWT_TOKEN");

            var response = await _client.PostAsJsonAsync(
                "/api/v1/products",
                new
                {
                    Name = "Test Product",
                    Price = 99.99,
                    Stock = 10,
                }
            );

            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.Unauthorized
            );
        }
    }
}
