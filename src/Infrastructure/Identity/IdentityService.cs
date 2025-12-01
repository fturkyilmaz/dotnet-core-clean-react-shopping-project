using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Infrastructure.Configuration;

namespace ShoppingProject.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly IConfiguration _configuration;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly JwtOptions _jwtOptions;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService,
        IConfiguration configuration,
        RoleManager<IdentityRole> roleManager
    )
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
        _configuration = configuration;
        _roleManager = roleManager;

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
        {
            return (Result.Failure(new[] { "User not found" }), null);
        }

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
        string password
    )
    {
        var user = new ApplicationUser { UserName = userName, Email = userName };

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
        {
            return false;
        }

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
            return (Result.Failure(new[] { "Invalid email or password." }), null);
        }

        var token = await GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpiryDays);

        await _userManager.UpdateAsync(user);

        return (
            Result.Success(),
            new AuthResponse
            {
                AccessToken = token,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime ?? DateTime.UtcNow,
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
            return (Result.Failure(new[] { "Invalid access token or refresh token" }), null);
        }

        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId!);

        if (
            user == null
            || user.RefreshToken != refreshToken
            || user.RefreshTokenExpiryTime <= DateTime.UtcNow
        )
        {
            return (Result.Failure(new[] { "Invalid access token or refresh token" }), null);
        }

        var newAccessToken = await GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);

        return (
            Result.Success(),
            new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime ?? DateTime.UtcNow,
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

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
    {
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret!);

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = false, // Important: we want to validate expired tokens
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
        {
            return Result.Failure(new[] { "User with this email already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            return Result.Failure(result.Errors.Select(e => e.Description).ToArray());
        }

        if (!string.IsNullOrEmpty(role))
        {
            await _userManager.AddToRoleAsync(user, role);
        }

        return Result.Success();
    }

    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret!);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(ClaimTypes.Email, user.Email!),
        };

        // Add role claims
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes),
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
        user.UpdateAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);

        return result.ToApplicationResult();
    }
}
