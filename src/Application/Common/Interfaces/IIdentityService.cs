using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs.Identity;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Common.Interfaces;

/// <summary>
/// Provides identity and access management operations such as
/// authentication, authorization, user, role and password management.
/// </summary>
public interface IIdentityService
{
    // =========================
    // Authentication
    // =========================

    /// <summary>
    /// Authenticates a user using email and password.
    /// </summary>
    Task<ServiceResult<AuthResponse>> LoginAsync(
        string email,
        string password
    );

    /// <summary>
    /// Refreshes access and refresh tokens.
    /// </summary>
    Task<ServiceResult<AuthResponse>> RefreshTokenAsync(
        string accessToken,
        string refreshToken
    );

    // =========================
    // User Management
    // =========================

    /// <summary>
    /// Registers a new user.
    /// </summary>
    Task<ServiceResult<string>> RegisterUserAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string gender,
        string role = Roles.Client
    );

    /// <summary>
    /// Retrieves detailed information of the current user.
    /// </summary>
    Task<ServiceResult<UserInfoResponse>> GetUserInfoAsync(string userId);

    /// <summary>
    /// Returns the username of the specified user.
    /// Used by logging and performance behaviors.
    /// </summary>
    Task<string?> GetUserNameAsync(string userId);

    /// <summary>
    /// Updates user profile information.
    /// </summary>
    Task<ServiceResult<string>> UpdateUserAsync(
        string userId,
        string firstName,
        string lastName,
        string gender
    );

    /// <summary>
    /// Deletes a user by user id.
    /// </summary>
    Task<ServiceResult<string>> DeleteUserAsync(string userId);

    // =========================
    // Role Management
    // =========================

    /// <summary>
    /// Assigns a role to a user.
    /// </summary>
    Task<ServiceResult<string>> AssignUserToRoleAsync(
        string userId,
        string role
    );

    /// <summary>
    /// Creates a new role.
    /// </summary>
    Task<ServiceResult<string>> CreateRoleAsync(string roleName);

    /// <summary>
    /// Retrieves roles of a user.
    /// </summary>
    Task<List<string>> GetRolesAsync(string userId);

    /// <summary>
    /// Checks if the user belongs to a specific role.
    /// </summary>
    Task<bool> IsInRoleAsync(string userId, string role);

    // =========================
    // Authorization
    // =========================

    /// <summary>
    /// Authorizes a user against a given policy.
    /// </summary>
    Task<bool> AuthorizeAsync(string userId, string policyName);

    // =========================
    // Password Management
    // =========================

    /// <summary>
    /// Sends a password reset link to the user's email.
    /// </summary>
    Task<ServiceResult<string>> SendPasswordResetLinkAsync(string email);

    /// <summary>
    /// Resets the user's password using a reset token.
    /// </summary>
    Task<ServiceResult<string>> ResetPasswordAsync(
        string email,
        string token,
        string newPassword
    );
}
