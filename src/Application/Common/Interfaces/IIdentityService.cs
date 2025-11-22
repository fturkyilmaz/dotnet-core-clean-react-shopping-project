using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);

    Task<(Result Result, AuthResponse? Response)> LoginAsync(string email, string password);

    Task<(Result Result, AuthResponse? Response)> RefreshTokenAsync(
        string token,
        string refreshToken
    );

    Task<Result> AddUserToRoleAsync(string userId, string role);

    Task<Result> CreateRoleAsync(string roleName);
}
