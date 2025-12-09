using Microsoft.AspNetCore.Identity;

namespace ShoppingProject.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public string? RefreshToken { get; set; }

    private DateTime? _refreshTokenExpiryTime;
    public DateTime? RefreshTokenExpiryTime
    {
        get => _refreshTokenExpiryTime;
        set =>
            _refreshTokenExpiryTime = value.HasValue
                ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
                : null;
    }

    public string? TenantId { get; set; }

    private DateTime _createAt;
    public DateTime CreateAt
    {
        get => _createAt;
        set => _createAt = DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    private DateTime _updateAt;
    public DateTime UpdateAt
    {
        get => _updateAt;
        set => _updateAt = DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }
}
