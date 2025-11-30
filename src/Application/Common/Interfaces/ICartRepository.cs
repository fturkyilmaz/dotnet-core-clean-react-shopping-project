using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Common.Interfaces;

public interface ICartRepository : IRepository<Cart>
{
    Task<int> DeleteAllAsync(CancellationToken cancellationToken = default);
}
