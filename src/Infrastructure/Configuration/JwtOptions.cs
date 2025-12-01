namespace ShoppingProject.Infrastructure.Configuration;

/// <summary>
/// JWT Configuration options for token validation and generation.
/// </summary>
public class JwtOptions
{
    /// <summary>
    /// Configuration section name in appsettings.json
    /// </summary>
    public const string SectionName = "JwtSettings";

    /// <summary>
    /// The issuer of the JWT token (who issued the token)
    /// </summary>
    public string? Issuer { get; set; }

    /// <summary>
    /// The audience for the JWT token (who the token is intended for)
    /// </summary>
    public string? Audience { get; set; }

    /// <summary>
    /// The secret key used to sign and verify JWT tokens
    /// </summary>
    public string? Secret { get; set; }

    /// <summary>
    /// Token expiry time in minutes
    /// </summary>
    public int ExpiryMinutes { get; set; } = 60;

    /// <summary>
    /// Refresh token expiry time in days
    /// </summary>
    public int RefreshTokenExpiryDays { get; set; } = 7;
}
