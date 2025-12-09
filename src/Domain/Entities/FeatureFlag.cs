namespace ShoppingProject.Domain.Entities;

/// <summary>
/// Feature flag entity for controlling feature rollouts
/// Supports percentage-based rollouts and user targeting
/// </summary>
public class FeatureFlag : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public int RolloutPercentage { get; set; } = 100; // 0-100
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<string> TargetedUserIds { get; set; } = new();
    public List<string> TargetedRoles { get; set; } = new();
    public Dictionary<string, string> Metadata { get; set; } = new();

    public bool IsActive(DateTimeOffset utcNow)
    {
        if (!IsEnabled)
            return false;
        
        if (StartDate.HasValue && utcNow.DateTime < StartDate.Value)
            return false;

        if (EndDate.HasValue && utcNow.DateTime > EndDate.Value)
            return false;

        return true;
    }

    public bool IsEnabledForUser(string userId, List<string> userRoles, DateTimeOffset utcNow)
    {
        if (!IsActive(utcNow))
            return false;

        // Check if user is specifically targeted
        if (TargetedUserIds.Any() && TargetedUserIds.Contains(userId))
            return true;

        // Check if user's role is targeted
        if (TargetedRoles.Any() && userRoles.Any(role => TargetedRoles.Contains(role)))
            return true;

        // Check rollout percentage
        if (RolloutPercentage < 100)
        {
            var hash = ComputeHash(userId);
            return hash % 100 < RolloutPercentage;
        }

        return true;
    }

    private static int ComputeHash(string input)
    {
        var hash = 0;
        foreach (var c in input)
        {
            hash = ((hash << 5) - hash) + c;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.Abs(hash);
    }
}
