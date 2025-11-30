using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<int> DeleteAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Carts.ExecuteDeleteAsync(cancellationToken);
    }
}
