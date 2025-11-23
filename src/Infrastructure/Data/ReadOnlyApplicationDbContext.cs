using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Infrastructure.Data;

public class ReadOnlyApplicationDbContext : ApplicationDbContext, IReadOnlyApplicationDbContext
{
    public ReadOnlyApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
        ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    public override int SaveChanges()
    {
        throw new InvalidOperationException("This context is read-only.");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException("This context is read-only.");
    }

    IQueryable<Product> IReadOnlyApplicationDbContext.Products => Products.AsNoTracking();
    IQueryable<Cart> IReadOnlyApplicationDbContext.Carts => Carts.AsNoTracking();
}
