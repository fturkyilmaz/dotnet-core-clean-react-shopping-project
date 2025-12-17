using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class CacheIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public CacheIntegrationTests(WebApplicationFactory<Program> factory)
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
        public async Task SetValue_Should_Return_OK()
        {
            await AuthenticateAsync();

            var response = await _client.PostAsJsonAsync(
                "/api/v1/cache/set",
                new { Key = "test-key", Value = "test-value" }
            );

            response.EnsureSuccessStatusCode();

            var getResponse = await _client.GetAsync("/api/v1/cache/test-key");
            getResponse.EnsureSuccessStatusCode();

            var value = await getResponse.Content.ReadAsStringAsync();
            Assert.Equal("\"test-value\"", value);
        }

        [Fact]
        public async Task GetValue_Should_Return_Value_When_Exists()
        {
            await AuthenticateAsync();

            await _client.PostAsJsonAsync(
                "/api/v1/cache/set",
                new { Key = "test-key", Value = "test-value" }
            );

            var response = await _client.GetAsync("/api/v1/cache/test-key");
            response.EnsureSuccessStatusCode();

            var value = await response.Content.ReadAsStringAsync();
            Assert.Equal("\"test-value\"", value);
        }

        [Fact]
        public async Task GetValue_Should_Return_NotFound_When_NotExists()
        {
            await AuthenticateAsync();

            var response = await _client.GetAsync("/api/v1/cache/non-existent-key");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteValue_Should_Return_OK()
        {
            await AuthenticateAsync();

            await _client.PostAsJsonAsync(
                "/api/v1/cache/set",
                new { Key = "delete-key", Value = "delete-value" }
            );

            var response = await _client.DeleteAsync("/api/v1/cache/delete-key");
            response.EnsureSuccessStatusCode();

            var getResponse = await _client.GetAsync("/api/v1/cache/delete-key");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }
    }
}
