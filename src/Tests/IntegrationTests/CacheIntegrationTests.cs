using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using Xunit;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class CacheIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public CacheIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task SetValue_Should_Return_OK()
        {
            var response = await _client.PostAsJsonAsync(
                "/api/v1/cache/set",
                new { Key = "test-key", Value = "test-value" }
            );

            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task GetValue_Should_Return_Value_When_Exists()
        {
            // Önce set et
            await _client.PostAsJsonAsync(
                "/api/v1/cache/set",
                new { Key = "test-key", Value = "test-value" }
            );

            // Sonra getir
            var response = await _client.GetAsync("/api/v1/cache/test-key");
            response.EnsureSuccessStatusCode();

            var value = await response.Content.ReadAsStringAsync();
            Assert.Equal("\"test-value\"", value); // JSON string döner
        }

        [Fact]
        public async Task GetValue_Should_Return_NotFound_When_NotExists()
        {
            var response = await _client.GetAsync("/api/v1/cache/non-existent-key");
            Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteValue_Should_Return_OK()
        {
            // Önce set et
            await _client.PostAsJsonAsync(
                "/api/v1/cache/set",
                new { Key = "delete-key", Value = "delete-value" }
            );

            // Sonra sil
            var response = await _client.DeleteAsync("/api/v1/cache/delete-key");
            response.EnsureSuccessStatusCode();

            // Tekrar getir → NotFound olmalı
            var getResponse = await _client.GetAsync("/api/v1/cache/delete-key");
            Assert.Equal(System.Net.HttpStatusCode.NotFound, getResponse.StatusCode);
        }
    }
}
