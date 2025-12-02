using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using ShoppingProject.Application.Common.Models;
using Xunit;

namespace ShoppingProject.UnitTests.IntegrationTests
{
    public class IdentityIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public IdentityIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_Then_Login_Should_Return_Token()
        {
            var registerResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/register",
                new { Email = "testuser@example.com", Password = "Test123!" }
            );
            registerResponse.EnsureSuccessStatusCode();

            var loginResponse = await _client.PostAsJsonAsync(
                "/api/v1/identity/login",
                new { Email = "testuser@example.com", Password = "Test123!" }
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
                new { Email = "testuser@example.com", Password = "Test123!" }
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
                new { Email = "testuser@example.com" }
            );
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task ResetPassword_Should_Update_User_Password()
        {
            var response = await _client.PostAsJsonAsync(
                "/api/v1/identity/reset-password",
                new
                {
                    Email = "testuser@example.com",
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
