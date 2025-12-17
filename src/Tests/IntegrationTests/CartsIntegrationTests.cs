using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class CartsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public CartsIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        private async Task AuthenticateAsync()
        {
            // Login
            var loginResponse = await _client.PostAsJsonAsync("/api/v1/identity/login", new
            {
                Email = "admin@test.com",
                Password = "Admin123!"
            });

            loginResponse.EnsureSuccessStatusCode();

            var loginResult = await loginResponse.Content.ReadFromJsonAsync<ServiceResult<AuthResponse>>();

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", loginResult!.Data!.AccessToken);
        }

        [Fact]
        public async Task GetAllCarts_Should_Return_List()
        {
            await AuthenticateAsync();

            var response = await _client.GetAsync("/api/v1/carts");
            response.EnsureSuccessStatusCode();

            var carts = await response.Content.ReadFromJsonAsync<ServiceResult<List<CartDto>>>();
            Assert.NotNull(carts);
        }

        [Fact]
        public async Task GetCartById_Should_Return_Cart()
        {
            await AuthenticateAsync();

            // Önce kullanıcının sepetlerini çek
            var cartsResponse = await _client.GetAsync("/api/v1/carts");
            cartsResponse.EnsureSuccessStatusCode();

            var result = await cartsResponse.Content.ReadFromJsonAsync<ServiceResult<List<CartDto>>>();
            Assert.NotNull(result);
            Assert.True(result!.IsSuccess);
            Assert.NotEmpty(result.Data!);

            // İlk sepetin id'sini al
            var cartId = result.Data![0].Id;

            var response = await _client.GetAsync($"/api/v1/carts/{cartId}");
            Assert.True(
                response.StatusCode == HttpStatusCode.OK
                    || response.StatusCode == HttpStatusCode.NotFound
            );
        }

        [Fact]
        public async Task CreateCart_Should_Return_Success_When_Authorized()
        {
            await AuthenticateAsync();

            var product = new { Title = "MBJ Women's Solid Short Sleeve Boat Neck V ", Description = "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem", Price = 9.85, Category = "women's clothing", Image = "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png", Rating = new { Rate = 4.7, Count = 130 }, Quantity = 1 };

            var response = await _client.PostAsJsonAsync(
                "/api/v1/carts",
               product
            );

            response.EnsureSuccessStatusCode();

            var createdCart = await response.Content.ReadFromJsonAsync<CartDto>();
            Assert.NotNull(createdCart);
        }

        [Fact]
        public async Task UpdateCart_Should_Return_Success_When_Authorized()
        {
            await AuthenticateAsync();

            // Önce kullanıcının sepetlerini çek
            var cartsResponse = await _client.GetAsync("/api/v1/carts");
            cartsResponse.EnsureSuccessStatusCode();

            var result = await cartsResponse.Content.ReadFromJsonAsync<ServiceResult<List<CartDto>>>();
            Assert.NotNull(result);
            Assert.True(result!.IsSuccess);
            Assert.NotEmpty(result.Data!);
            Assert.True(result.Data![0].Id > 0);

            // İlk sepetin id'sini al
            var cartId = result.Data![0].Id;

            var product = new { Title = "MBJ Women's Solid Short Sleeve Boat Neck V ", Description = "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem", Price = 9.85, Category = "women's clothing", Image = "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png", Rating = new { Rate = 4.7, Count = 130 }, Quantity = 1, Id = cartId };

            var response = await _client.PutAsJsonAsync(
                $"/api/v1/carts/{cartId}",
               product
            );

            Assert.True(
                response.StatusCode == HttpStatusCode.OK
                    || response.StatusCode == HttpStatusCode.NotFound
            );
        }

        [Fact]
        public async Task DeleteCart_Should_Return_Success_When_Authorized()
        {
            await AuthenticateAsync();

            // Önce kullanıcının sepetlerini çek
            var cartsResponse = await _client.GetAsync("/api/v1/carts");
            cartsResponse.EnsureSuccessStatusCode();

            var result = await cartsResponse.Content.ReadFromJsonAsync<ServiceResult<List<CartDto>>>();
            Assert.NotNull(result);
            Assert.True(result!.IsSuccess);
            Assert.NotEmpty(result.Data!);

            // İlk sepetin id'sini al
            var cartId = result.Data![0].Id;

            var response = await _client.DeleteAsync($"/api/v1/carts/{cartId}");

            Assert.True(
                response.StatusCode == HttpStatusCode.OK
                || response.StatusCode == HttpStatusCode.NotFound
            );
        }

    }
}
