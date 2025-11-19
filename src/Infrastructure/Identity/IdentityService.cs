using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    public Task<string?> GetUserNameAsync(string userId)
    {
        return Task.FromResult<string?>("Unknown User");
    }

    public Task<bool> IsInRoleAsync(string userId, string role)
    {
        return Task.FromResult(true);
    }

    public Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        return Task.FromResult(true);
    }

    public Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password)
    {
        return Task.FromResult((Result.Success(), Guid.NewGuid().ToString()));
    }

    public Task<Result> DeleteUserAsync(string userId)
    {
        return Task.FromResult(Result.Success());
    }
}
