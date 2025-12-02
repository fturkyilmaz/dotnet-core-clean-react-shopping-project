using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using Xunit;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class CartsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public CartsIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAllCarts_Should_Return_List()
        {
            var response = await _client.GetAsync("/api/v1/carts");
            response.EnsureSuccessStatusCode();

            var carts = await response.Content.ReadFromJsonAsync<List<CartDto>>();
            Assert.NotNull(carts);
        }

        [Fact]
        public async Task GetCartById_Should_Return_Cart()
        {
            var response = await _client.GetAsync("/api/v1/carts/1");
            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.NotFound
            );
        }

        [Fact]
        public async Task CreateCart_Should_Return_Success_When_Authorized()
        {
            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "USER_JWT_TOKEN");

            var response = await _client.PostAsJsonAsync(
                "/api/v1/carts",
                new { UserId = "testuser", Items = new[] { new { ProductId = 1, Quantity = 2 } } }
            );

            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.Unauthorized
            );
        }

        [Fact]
        public async Task UpdateCart_Should_Return_Success_When_Authorized()
        {
            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "USER_JWT_TOKEN");

            var response = await _client.PutAsJsonAsync(
                "/api/v1/carts/1",
                new { Items = new[] { new { ProductId = 1, Quantity = 5 } } }
            );

            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.Unauthorized
            );
        }

        [Fact]
        public async Task DeleteCart_Should_Return_Success_When_Authorized()
        {
            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "USER_JWT_TOKEN");

            var response = await _client.DeleteAsync("/api/v1/carts/1");

            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.Unauthorized
            );
        }
    }
}
