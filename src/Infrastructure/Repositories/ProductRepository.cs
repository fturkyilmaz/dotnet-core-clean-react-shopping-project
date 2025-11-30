using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<List<Product>> GetByCategoryAsync(
        string category,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Products.Where(p => p.Category == category)
            .ToListAsync(cancellationToken);
    }
}
