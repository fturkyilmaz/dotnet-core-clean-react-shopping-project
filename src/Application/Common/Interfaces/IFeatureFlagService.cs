namespace ShoppingProject.Application.Common.Services;

public interface IFeatureFlagService
{
    Task<bool> IsEnabledAsync(
        string featureName,
        string? userId = null,
        CancellationToken cancellationToken = default
    );
    Task<T> GetVariantAsync<T>(
        string featureName,
        T defaultValue,
        CancellationToken cancellationToken = default
    );
}
