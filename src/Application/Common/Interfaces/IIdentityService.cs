using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IIdentityService
{
    // AUTH
    Task<ServiceResult<AuthResponse>> LoginAsync(string email, string password);
    Task<ServiceResult<AuthResponse>> RefreshTokenAsync(string token, string refreshToken);

    // USER
    Task<ServiceResult<string>> RegisterAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string gender,
        string role
    );

    Task<ServiceResult<UserInfoResponse>> GetUserInfoAsync(string userId);

    Task<ServiceResult<UserInfoResponse>> UpdateUserAsync(
        string userId,
        string firstName,
        string lastName,
        string gender
    );

    Task<ServiceResult<string>> DeleteUserAsync(string userId);

    // ROLE
    Task<ServiceResult<string>> AssignUserToRoleAsync(string userId, string role);
    Task<ServiceResult<string>> CreateRoleAsync(string roleName);

    // PASSWORD
    Task<ServiceResult<string>> SendPasswordResetLinkAsync(string email);
    Task<ServiceResult<string>> ResetPasswordAsync(string email, string token, string newPassword);

    // OTHER
    Task<bool> AuthorizeAsync(string userId, string policyName);
    Task<string?> GetUserNameAsync(string userId);

    /// <summary> /// Get all users in the system. /// </summary>
    Task<ServiceResult<List<UserInfoResponse>>> GetAllUsersAsync();
}
