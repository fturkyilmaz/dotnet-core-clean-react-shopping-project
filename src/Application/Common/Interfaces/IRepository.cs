using ShoppingProject.Application.Common.Specifications;

namespace ShoppingProject.Application.Common.Interfaces;

/// <summary>
/// Generic repository interface for entity operations.
/// Note: SaveChanges is managed by IUnitOfWork to ensure transaction consistency.
/// </summary>
public interface IRepository<T>
    where T : class
{
    /// <summary>
    /// Gets an entity by its ID.
    /// </summary>
    Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all entities (use with caution on large datasets).
    /// </summary>
    Task<IReadOnlyList<T>> ListAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets entities matching the given specification.
    /// </summary>
    Task<IReadOnlyList<T>> ListAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Gets the first entity matching the specification.
    /// </summary>
    Task<T?> FirstOrDefaultAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Counts entities matching the specification.
    /// </summary>
    Task<int> CountAsync(ISpecification<T> spec, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new entity to the context.
    /// Note: Call IUnitOfWork.SaveChangesAsync() to persist.
    /// </summary>
    void Add(T entity);

    /// <summary>
    /// Updates an existing entity.
    /// Note: Call IUnitOfWork.SaveChangesAsync() to persist.
    /// </summary>
    void Update(T entity);

    /// <summary>
    /// Deletes an entity.
    /// Note: Call IUnitOfWork.SaveChangesAsync() to persist.
    /// </summary>
    void Delete(T entity);

    /// <summary>
    /// Deletes entities matching the specification.
    /// This operation is executed immediately in the database.
    /// </summary>
    Task<int> DeleteRangeAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Checks if any entity matches the specification.
    /// </summary>
    Task<bool> ExistsAsync(ISpecification<T> spec, CancellationToken cancellationToken = default);
}
