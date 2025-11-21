using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    IQueryable<Product> Products { get; }
    IQueryable<Cart> Carts { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    
    void Add<T>(T entity) where T : class;
    void Remove<T>(T entity) where T : class;
}
