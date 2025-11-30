using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<List<Product>> GetByCategoryAsync(
        string category,
        CancellationToken cancellationToken = default
    );
}
