using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Repositories;

public class FeatureFlagRepository : Repository<FeatureFlag>, IFeatureFlagRepository
{
    public FeatureFlagRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<FeatureFlag?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.FeatureFlags.FirstOrDefaultAsync(
            f => f.Name == name,
            cancellationToken
        );
    }

    public async Task<List<FeatureFlag>> GetActiveFeatureFlagsAsync(
        CancellationToken cancellationToken = default
    )
    {
        return await _context.FeatureFlags.Where(f => f.IsEnabled).ToListAsync(cancellationToken);
    }
}
