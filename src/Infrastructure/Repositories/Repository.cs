using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation.
/// Note: This repository does not call SaveChanges - it must be done via IUnitOfWork.
/// </summary>
public class Repository<T> : IRepository<T>
    where T : class
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _dbSet = context.Set<T>();
    }

    /// <inheritdoc />
    public virtual async Task<T?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<T>> ListAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<T>> ListAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<T?> FirstOrDefaultAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<int> CountAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).CountAsync(cancellationToken);
    }

    /// <inheritdoc />
    public void Add(T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));

        _dbSet.Add(entity);
    }

    /// <inheritdoc />
    public void Update(T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));

        _dbSet.Update(entity);
    }

    /// <inheritdoc />
    public void Delete(T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));

        _dbSet.Remove(entity);
    }

    /// <inheritdoc />
    public async Task<int> DeleteRangeAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default)
    {
        var query = ApplySpecification(spec);
        return await query.ExecuteDeleteAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<bool> ExistsAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default)
    {
        return await ApplySpecification(spec).AnyAsync(cancellationToken);
    }

    /// <summary>
    /// Applies the specification to the query.
    /// </summary>
    protected virtual IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), spec);
    }

    #region Backward Compatibility (for tests)

    /// <summary>
    /// Adds an entity asynchronously.
    /// Note: Use Add() with IUnitOfWork for proper transaction control.
    /// </summary>
    public Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        Add(entity);
        return Task.FromResult(entity);
    }

    /// <summary>
    /// Updates an entity asynchronously.
    /// Note: Use Update() with IUnitOfWork for proper transaction control.
    /// </summary>
    public Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        Update(entity);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Deletes an entity asynchronously.
    /// Note: Use Delete() with IUnitOfWork for proper transaction control.
    /// </summary>
    public Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        Delete(entity);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Saves changes asynchronously.
    /// Note: Use IUnitOfWork for proper transaction control.
    /// </summary>
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }

    #endregion
}
