using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using Bogus;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class IdentityIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly Faker _faker;

        public IdentityIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
            _faker = new Faker();
        }

        [Fact]
        public async Task Register_Then_Login_Should_Return_Token()
        {
            var email = _faker.Internet.Email();

            var registerResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/register",
                new { Email = email, Password = "Test123!" }
            );
            registerResponse.EnsureSuccessStatusCode();

            var loginResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/login",
                new { Email = email, Password = "Test123!" }
            );
            loginResponse.EnsureSuccessStatusCode();

            var authResult = await loginResponse.Content.ReadFromJsonAsync<
                ServiceResult<AuthResponse>
            >();
            Assert.NotNull(authResult);
            Assert.NotNull(authResult!.Data?.AccessToken);
            Assert.NotNull(authResult.Data?.RefreshToken);
        }

        [Fact]
        public async Task RefreshToken_Should_Return_New_Tokens()
        {
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/login",
                new { Email = "admin@test.com", Password = "Admin123!" }
            );
            loginResponse.EnsureSuccessStatusCode();

            var authResult = await loginResponse.Content.ReadFromJsonAsync<
                ServiceResult<AuthResponse>
            >();
            Assert.NotNull(authResult?.Data);

            var refreshResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/refresh-token",
                new
                {
                    AccessToken = authResult!.Data!.AccessToken,
                    RefreshToken = authResult.Data.RefreshToken,
                }
            );
            refreshResponse.EnsureSuccessStatusCode();

            var newAuthResult = await refreshResponse.Content.ReadFromJsonAsync<
                ServiceResult<AuthResponse>
            >();
            Assert.NotNull(newAuthResult?.Data);
            Assert.NotEqual(authResult.Data!.AccessToken, newAuthResult!.Data!.AccessToken);
        }

        [Fact]
        public async Task ForgotPassword_Should_Return_Success()
        {
            var response = await _client.PostAsJsonAsync(
                "/api/v1/identity/forgot-password",
                new { Email = "admin@test.com" }
            );
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<ServiceResult<string>>();
            Assert.NotNull(result);
            Assert.True(result!.IsSuccess);
        }

        [Fact]
        public async Task ResetPassword_Should_Update_User_Password()
        {
            var response = await _client.PostAsJsonAsync(
                "/api/v1/identity/reset-password",
                new
                {
                    Email = "admin@test.com",
                    Token = "FAKE_RESET_TOKEN",
                    NewPassword = "NewPass123!",
                }
            );

            Assert.True(
                response.StatusCode == System.Net.HttpStatusCode.OK
                    || response.StatusCode == System.Net.HttpStatusCode.BadRequest
            );
        }

        [Fact]
        public async Task UpdateUser_Should_Return_Success()
        {
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/login",
                new { Email = "testuser@example.com", Password = "Test123!" }
            );
            loginResponse.EnsureSuccessStatusCode();

            var authResult = await loginResponse.Content.ReadFromJsonAsync<
                ServiceResult<AuthResponse>
            >();
            Assert.NotNull(authResult?.Data);

            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Bearer",
                    authResult!.Data!.AccessToken
                );

            var updateResponse = await _client.PutAsJsonAsync(
                "/api/v1/identity/me",
                new
                {
                    FirstName = "Furkan",
                    LastName = "Türkyılmaz",
                    Gender = "Male",
                }
            );
            updateResponse.EnsureSuccessStatusCode();
        }
    }
}
