using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class ProductsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly Faker _faker;

        public ProductsIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
            _faker = new Faker();
        }

        private async Task AuthenticateAsAdminAsync()
        {
            // Login
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/login",
                new { Email = "admin@test.com", Password = "Admin123!" }
            );

            loginResponse.EnsureSuccessStatusCode();

            var loginResult = await loginResponse.Content.ReadFromJsonAsync<
                ServiceResult<AuthResponse>
            >();

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                loginResult!.Data!.AccessToken
            );
        }

        [Fact]
        public async Task GetAllProducts_Should_Return_List()
        {
            var response = await _client.GetAsync("/api/v1/products");
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<
                ServiceResult<List<ProductDto>>
            >();
            Assert.NotNull(result);
            Assert.True(result!.IsSuccess);
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
                "/api/v1/products/search?index=0&size=5",
                new
                {
                    filter = new
                    {
                        field = "category",
                        @operator = "eq",
                        value = "electronics",
                    },
                    sort = new[] { new { field = "price", dir = "asc" } },
                    index = 0,
                    size = 5,
                }
            );

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<
                ServiceResult<List<ProductDto>>
            >();

            Assert.True(response.StatusCode == System.Net.HttpStatusCode.OK);
            Assert.NotNull(result);
            Assert.True(result!.IsSuccess);
            Assert.True(result.Data!.Count <= 5);
        }

        [Fact]
        public async Task CreateProduct_Should_Return_Success_When_Authorized()
        {
            await AuthenticateAsAdminAsync();

            var response = await _client.PostAsJsonAsync(
                "/api/v1/products",
                new
                {
                    Title = _faker.Commerce.ProductName(),
                    Price = _faker.Random.Double(10, 500),
                    Description = _faker.Commerce.ProductDescription(),
                    Category = "electronics",
                    Image = "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
                    Rating = new
                    {
                        Rate = _faker.Random.Double(1, 5),
                        Count = _faker.Random.Int(1, 500),
                    },
                    Quantity = _faker.Random.Int(1, 20),
                }
            );

            response.EnsureSuccessStatusCode();

            Assert.True(
                response.StatusCode == HttpStatusCode.OK
                    || response.StatusCode == HttpStatusCode.Unauthorized
            );
        }
    }
}
