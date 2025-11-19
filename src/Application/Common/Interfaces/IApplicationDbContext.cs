using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Cart> Carts { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
