using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Infrastructure.Configuration;

namespace ShoppingProject.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly IEmailService _emailService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly JwtOptions _jwtOptions;
    private readonly ILogger<IdentityService> _logger;
    private readonly IClock _clock;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService,
        IConfiguration configuration,
        RoleManager<IdentityRole> roleManager,
        ILogger<IdentityService> logger,
        IEmailService emailService,
        IClock clock
    )
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
        _roleManager = roleManager;
        _logger = logger;
        _emailService = emailService;
        _clock = clock;
        _jwtOptions = new JwtOptions();
        configuration.GetSection(JwtOptions.SectionName).Bind(_jwtOptions);
    }

    // =====================================================
    // PUBLIC – APPLICATION FACING (ServiceResult)
    // =====================================================

    public async Task<ServiceResult<AuthResponse>> LoginAsync(string email, string password)
    {
        var (result, response) = await LoginInternalAsync(email, password);

        return result.Succeeded && response != null
            ? ServiceResult<AuthResponse>.Success(response)
            : ServiceResult<AuthResponse>.Fail(result.Errors);
    }

    public async Task<ServiceResult<AuthResponse>> RefreshTokenAsync(
        string token,
        string refreshToken
    )
    {
        var (result, response) = await RefreshTokenInternalAsync(token, refreshToken);

        return result.Succeeded && response != null
            ? ServiceResult<AuthResponse>.Success(response)
            : ServiceResult<AuthResponse>.Fail(result.Errors);
    }

    public async Task<ServiceResult<string>> RegisterAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string gender,
        string role
    )
    {
        var result = await RegisterInternalAsync(
            email,
            password,
            firstName,
            lastName,
            gender,
            role
        );

        return result.Succeeded
            ? ServiceResult<string>.Success("User registered successfully.")
            : ServiceResult<string>.Fail(result.Errors);
    }

    public async Task<ServiceResult<UserInfoResponse>> GetUserInfoAsync(string userId)
    {
        var (result, response) = await GetUserByIdInternalAsync(userId);

        return result.Succeeded && response != null
            ? ServiceResult<UserInfoResponse>.Success(response)
            : ServiceResult<UserInfoResponse>.Fail(result.Errors);
    }

    public async Task<ServiceResult<string>> AssignUserToRoleAsync(string userId, string role)
    {
        var result = await AddUserToRoleInternalAsync(userId, role);

        if (result.Succeeded)
        {
            _logger.LogInformation("User {UserId} assigned to role {Role}", userId, role);
        }

        return result.Succeeded
            ? ServiceResult<string>.Success("Role assigned successfully.")
            : ServiceResult<string>.Fail(result.Errors);
    }

    public async Task<ServiceResult<string>> CreateRoleAsync(string roleName)
    {
        var result = await CreateRoleInternalAsync(roleName);

        return result.Succeeded
            ? ServiceResult<string>.Success("Role created successfully.")
            : ServiceResult<string>.Fail(result.Errors);
    }

    public async Task<ServiceResult<string>> SendPasswordResetLinkAsync(string email)
    {
        var result = await RequestPasswordResetInternalAsync(email);

        return result.Succeeded
            ? ServiceResult<string>.Success("Password reset link sent.")
            : ServiceResult<string>.Fail(result.Errors);
    }

    public async Task<ServiceResult<string>> ResetPasswordAsync(
        string email,
        string token,
        string newPassword
    )
    {
        var result = await ResetPasswordInternalAsync(email, token, newPassword);

        return result.Succeeded
            ? ServiceResult<string>.Success("Password reset successful.")
            : ServiceResult<string>.Fail(result.Errors);
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.UserName;
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);
        var result = await _authorizationService.AuthorizeAsync(principal, policyName);
        return result.Succeeded;
    }

    // =====================================================
    // INTERNAL – DOMAIN / INFRA LOGIC (Result + Tuple)
    // =====================================================

    private async Task<(Result Result, AuthResponse? Response)> LoginInternalAsync(
        string email,
        string password
    )
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
        {
            _logger.LogWarning("Failed login attempt for email {Email}", email);

            return (Result.Failure(new[] { "Invalid email or password." }), null);
        }

        var token = await GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = HashRefreshToken(refreshToken);
        user.RefreshTokenExpiryTime = _clock.UtcNow.UtcDateTime.AddDays(
            _jwtOptions.RefreshTokenExpiryDays
        );
        user.UpdateAt = _clock.UtcNow.UtcDateTime;

        await _userManager.UpdateAsync(user);

        return (
            Result.Success(),
            new AuthResponse(
                token,
                refreshToken,
                _clock.UtcNow.UtcDateTime.AddMinutes(_jwtOptions.ExpiryMinutes)
            )
        );
    }

    private async Task<(Result Result, AuthResponse? Response)> RefreshTokenInternalAsync(
        string token,
        string refreshToken
    )
    {
        var principal = GetPrincipalFromExpiredToken(token);
        if (principal == null)
            return (Result.Failure(new[] { "Invalid token." }), null);

        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);

        if (user == null)
            return (Result.Failure(new[] { "User not found." }), null);

        if (user.RefreshToken != HashRefreshToken(refreshToken))
            return (Result.Failure(new[] { "Invalid refresh token." }), null);

        var newToken = await GenerateJwtToken(user);
        var newRefresh = GenerateRefreshToken();

        user.RefreshToken = HashRefreshToken(newRefresh);
        user.RefreshTokenExpiryTime = _clock.UtcNow.UtcDateTime.AddDays(
            _jwtOptions.RefreshTokenExpiryDays
        );

        await _userManager.UpdateAsync(user);

        return (
            Result.Success(),
            new AuthResponse(
                newToken,
                newRefresh,
                _clock.UtcNow.UtcDateTime.AddMinutes(_jwtOptions.ExpiryMinutes)
            )
        );
    }

    private async Task<Result> RegisterInternalAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string gender,
        string role
    )
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Gender = gender,
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return Result.Failure(result.Errors.Select(e => e.Description).ToArray());

        await _userManager.AddToRoleAsync(user, role);
        return Result.Success();
    }

    private async Task<(Result Result, UserInfoResponse? Response)> GetUserByIdInternalAsync(
        string userId
    )
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return (Result.Failure(new[] { "User not found." }), null);

        return (
            Result.Success(),
            new UserInfoResponse(
                user.Id,
                user.Email!,
                user.FirstName!,
                user.LastName!,
                user.UserName!,
                user.Gender!,
                new List<string>()
            )
        );
    }

    private async Task<Result> AddUserToRoleInternalAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure(new[] { "User not found." });

        var result = await _userManager.AddToRoleAsync(user, role);
        return result.ToApplicationResult();
    }

    private async Task<Result> CreateRoleInternalAsync(string roleName)
    {
        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        return result.ToApplicationResult();
    }

    private async Task<Result> RequestPasswordResetInternalAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return Result.Failure(new[] { "User not found." });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        await _emailService.SendPasswordResetEmailAsync(email, token);

        return Result.Success();
    }

    private async Task<Result> ResetPasswordInternalAsync(
        string email,
        string token,
        string newPassword
    )
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return Result.Failure(new[] { "User not found." });

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        return result.ToApplicationResult();
    }

    // =====================================================
    // HELPERS
    // =====================================================

    private static string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes);
    }

    private static string HashRefreshToken(string token)
    {
        using var sha = SHA256.Create();
        return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(token)));
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret!);

        var parameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
        };

        var handler = new JwtSecurityTokenHandler();
        return handler.ValidateToken(token, parameters, out _);
    }

    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret!);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!),
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            claims,
            expires: _clock.UtcNow.UtcDateTime.AddMinutes(_jwtOptions.ExpiryMinutes),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            )
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<ServiceResult<UserInfoResponse>> UpdateUserAsync(
        string userId,
        string? firstName,
        string? lastName,
        string? gender
    )
    {
        if (string.IsNullOrWhiteSpace(userId))
            return ServiceResult<UserInfoResponse>.Fail("User not authenticated.");

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            _logger.LogWarning("UpdateUser failed. User not found. UserId: {UserId}", userId);
            return ServiceResult<UserInfoResponse>.Fail("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(firstName))
            user.FirstName = firstName;

        if (!string.IsNullOrWhiteSpace(lastName))
            user.LastName = lastName;

        if (!string.IsNullOrWhiteSpace(gender))
            user.Gender = gender;

        user.UpdateAt = _clock.UtcNow.UtcDateTime;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            _logger.LogError(
                "UpdateUser failed for UserId {UserId}. Errors: {Errors}",
                userId,
                string.Join(", ", updateResult.Errors.Select(e => e.Description))
            );

            return ServiceResult<UserInfoResponse>.Fail(
                updateResult.Errors.Select(e => e.Description)
            );
        }

        var roles = await _userManager.GetRolesAsync(user);

        var response = new UserInfoResponse(
            user.Id,
            user.Email ?? string.Empty,
            user.FirstName ?? string.Empty,
            user.LastName ?? string.Empty,
            user.UserName ?? string.Empty,
            user.Gender ?? string.Empty,
            roles.ToList()
        );

        _logger.LogInformation("User {UserId} updated successfully", userId);

        return ServiceResult<UserInfoResponse>.Success(response);
    }

    public Task<ServiceResult<string>> DeleteUserAsync(string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<ServiceResult<List<UserInfoResponse>>> GetAllUsersAsync()
    {
        var users = _userManager.Users.ToList();

        var mapped = new List<UserInfoResponse>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            mapped.Add(
                new UserInfoResponse(
                    user.Id,
                    user.Email ?? string.Empty,
                    user.FirstName ?? string.Empty,
                    user.LastName ?? string.Empty,
                    user.UserName ?? string.Empty,
                    user.Gender ?? string.Empty,
                    roles.ToList()
                )
            );
        }

        return ServiceResult<List<UserInfoResponse>>.Success(mapped);
    }
}
