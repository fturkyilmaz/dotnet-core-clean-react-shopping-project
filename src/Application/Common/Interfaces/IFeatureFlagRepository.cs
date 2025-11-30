using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IFeatureFlagRepository : IRepository<FeatureFlag>
{
    Task<FeatureFlag?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<List<FeatureFlag>> GetActiveFeatureFlagsAsync(
        CancellationToken cancellationToken = default
    );
}
