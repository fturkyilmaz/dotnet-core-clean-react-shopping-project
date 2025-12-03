using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<string?> GetUserNameAsync(string userId);

        Task<(Result Result, UserInfoResponse? Response)> GetUserByIdAsync(string userId);

        Task<bool> IsInRoleAsync(string userId, string role);

        Task<bool> AuthorizeAsync(string userId, string policyName);

        Task<(Result Result, string UserId)> CreateUserAsync(
            string userName,
            string password,
            string? firstName = null,
            string? lastName = null,
            string? gender = null,
            string role = Roles.Client
        );

        Task<Result> DeleteUserAsync(string userId);

        Task<(Result Result, AuthResponse? Response)> LoginAsync(string email, string password);

        Task<(Result Result, AuthResponse? Response)> RefreshTokenAsync(
            string token,
            string refreshToken
        );

        Task<Result> AddUserToRoleAsync(string userId, string role);

        Task<Result> CreateRoleAsync(string roleName);

        Task<Result> UpdateUserAsync(
            string userId,
            string firstName,
            string lastName,
            string gender
        );

        Task<Result> RequestPasswordResetAsync(string email);
        Task<Result> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
