using System.Linq.Expressions;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Domain.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
    Task<IPaginate<T>> GetListAsync(Expression<Func<T, bool>>? predicate = null,
                                    Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
                                    Func<IQueryable<T>, IQueryable<T>>? include = null,
                                    int index = 0, int size = 10, bool enableTracking = true,
                                    CancellationToken cancellationToken = default);
    
    Task<IPaginate<T>> GetListByDynamicAsync(DynamicQuery dynamicQuery,
                                             Expression<Func<T, bool>>? predicate = null,
                                             Func<IQueryable<T>, IQueryable<T>>? include = null,
                                             int index = 0, int size = 10, bool enableTracking = true,
                                             CancellationToken cancellationToken = default);

    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<T> DeleteAsync(T entity);
}
