using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);

    Task<(Result Result, string Token)> LoginAsync(string email, string password);

    Task<Result> AddUserToRoleAsync(string userId, string role);

    Task<Result> CreateRoleAsync(string roleName);
}
