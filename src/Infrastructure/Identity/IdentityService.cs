using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Configuration;

namespace ShoppingProject.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly IEmailService _emailService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly IConfiguration _configuration;
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
        _configuration = configuration;
        _roleManager = roleManager;
        _logger = logger;
        _emailService = emailService;
        _clock = clock;
        _jwtOptions = new JwtOptions();
        configuration.GetSection(JwtOptions.SectionName).Bind(_jwtOptions);
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.UserName;
    }

    public async Task<(Result Result, UserInfoResponse? Response)> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return (Result.Failure(new[] { "User not found." }), null);

        var response = new UserInfoResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Gender = user.Gender,
        };

        return (Result.Success(), response);
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(
        string userName,
        string password,
        string? firstName = null,
        string? lastName = null,
        string? gender = null,
        string role = Roles.Client
    )
    {
        var user = new ApplicationUser
        {
            UserName = userName,
            Email = userName,
            FirstName = firstName,
            LastName = lastName,
            Gender = gender,
        };
        var result = await _userManager.CreateAsync(user, password);
        return (result.ToApplicationResult(), user.Id);
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

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null ? await DeleteUserAsync(user) : Result.Success();
    }

    public async Task<Result> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);
        return result.ToApplicationResult();
    }

    public async Task<(Result Result, AuthResponse? Response)> LoginAsync(
        string email,
        string password
    )
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, password))
        {
            _logger.LogWarning("Failed login attempt for email: {Email}", email);
            return (Result.Failure(new[] { "Invalid email or password." }), null);
        }

        var token = await GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = HashRefreshToken(refreshToken);
        user.RefreshTokenExpiryTime = _clock.UtcNow.DateTime.AddDays(_jwtOptions.RefreshTokenExpiryDays);

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} logged in successfully", user.Id);

        return (
            Result.Success(),
            new AuthResponse
            {
                AccessToken = token,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime ?? _clock.UtcNow.DateTime,
            }
        );
    }

    public async Task<(Result Result, AuthResponse? Response)> RefreshTokenAsync(
        string token,
        string refreshToken
    )
    {
        var principal = GetPrincipalFromExpiredToken(token);
        if (principal == null)
        {
            _logger.LogWarning("Invalid access token provided for refresh");
            return (Result.Failure(new[] { "Invalid access token or refresh token." }), null);
        }

        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);

        if (user == null)
        {
            _logger.LogWarning("Refresh token attempt for non-existent user: {UserId}", userId);
            return (Result.Failure(new[] { "Invalid access token or refresh token." }), null);
        }

        var hashedRefreshToken = HashRefreshToken(refreshToken);
        if (
            user.RefreshToken != hashedRefreshToken
            || user.RefreshTokenExpiryTime <= _clock.UtcNow.DateTime
        )
        {
            _logger.LogWarning("Invalid or expired refresh token for user: {UserId}", userId);
            return (Result.Failure(new[] { "Invalid access token or refresh token." }), null);
        }

        var newAccessToken = await GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = HashRefreshToken(newRefreshToken);
        user.RefreshTokenExpiryTime = _clock.UtcNow.DateTime.AddDays(_jwtOptions.RefreshTokenExpiryDays);
        // TODO: Add refresh token revocation list (invalidate old tokens)
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Refresh token successfully rotated for user: {UserId}", userId);

        return (
            Result.Success(),
            new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime ?? _clock.UtcNow.DateTime,
            }
        );
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private string HashRefreshToken(string refreshToken)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(refreshToken);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
    {
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret!);

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = false, // only for refresh flow
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(
            token,
            tokenValidationParameters,
            out SecurityToken securityToken
        );

        if (
            securityToken is not JwtSecurityToken jwtSecurityToken
            || !jwtSecurityToken.Header.Alg.Equals(
                SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase
            )
        )
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }

    public async Task<Result> RegisterAsync(
        string email,
        string password,
        string? firstName = null,
        string? lastName = null,
        string role = Roles.Client
    )
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
            return Result.Failure(new[] { "User with this email already exists." });

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Gender = "men",
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return Result.Failure(result.Errors.Select(e => e.Description).ToArray());

        if (!string.IsNullOrEmpty(role))
            await _userManager.AddToRoleAsync(user, role);

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = HashRefreshToken(refreshToken);
        user.RefreshTokenExpiryTime = _clock.UtcNow.DateTime.AddDays(_jwtOptions.RefreshTokenExpiryDays);
        // TODO: Add refresh token revocation list (invalidate old tokens)
        await _userManager.UpdateAsync(user);

        return Result.Success();
    }

    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret!);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
            new Claim("CorrelationId", Guid.NewGuid().ToString()),
            new Claim("TenantId", user.TenantId ?? string.Empty),
        };

        // Roles
        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        // User claims
        var userClaims = await _userManager.GetClaimsAsync(user);
        claims.AddRange(userClaims);

        // Role claims
        foreach (var role in roles)
        {
            var identityRole = await _roleManager.FindByNameAsync(role);
            if (identityRole != null)
            {
                var roleClaims = await _roleManager.GetClaimsAsync(identityRole);
                claims.AddRange(roleClaims);
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = _clock.UtcNow.DateTime.AddMinutes(_jwtOptions.ExpiryMinutes),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            ),
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<Result> AddUserToRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Result.Failure(new[] { "User not found." });
        }

        var roleExists = await _userManager.GetRolesAsync(user);
        if (roleExists.Contains(role))
        {
            return Result.Failure(new[] { $"User already has the role '{role}'." });
        }

        var result = await _userManager.AddToRoleAsync(user, role);

        return result.ToApplicationResult();
    }

    public async Task<Result> CreateRoleAsync(string roleName)
    {
        var roleExists = await _roleManager.RoleExistsAsync(roleName);

        if (roleExists)
        {
            return Result.Failure(new[] { $"Role '{roleName}' already exists." });
        }

        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));

        return result.ToApplicationResult();
    }

    public async Task<Result> UpdateUserAsync(
        string userId,
        string firstName,
        string lastName,
        string gender
    )
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Result.Failure(new[] { "User not found." });
        }

        user.FirstName = firstName;
        user.LastName = lastName;
        user.Gender = gender;
        user.UpdateAt = _clock.UtcNow.DateTime;

        var result = await _userManager.UpdateAsync(user);

        return result.ToApplicationResult();
    }

    public async Task<Result> RequestPasswordResetAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Result.Failure(new[] { "User not found." });
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        // Mail gönder
        await _emailService.SendPasswordResetEmailAsync(email, token);

        _logger.LogInformation("Password reset token generated for user {UserId}", user.Id);

        return Result.Success();
    }

    public async Task<Result> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Result.Failure(new[] { "User not found." });
        }

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

        if (!result.Succeeded)
        {
            return Result.Failure(result.Errors.Select(e => e.Description).ToArray());
        }

        _logger.LogInformation("Password reset successfully for user {UserId}", user.Id);

        return Result.Success();
    }
}
