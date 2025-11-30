using ShoppingProject.Application.Common.Specifications;

namespace ShoppingProject.Application.Common.Interfaces;

public interface IRepository<T>
    where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> ListAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> ListAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default
    );
    Task<T?> FirstOrDefaultAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default
    );
    Task<int> CountAsync(ISpecification<T> spec, CancellationToken cancellationToken = default);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
    Task<int> DeleteRangeAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default
    );
}
