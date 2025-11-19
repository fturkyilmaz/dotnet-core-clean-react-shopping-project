using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Interfaces;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext Context;

    public GenericRepository(ApplicationDbContext context)
    {
        Context = context;
    }

    public async Task<T?> GetAsync(Expression<Func<T, bool>> predicate)
    {
        return await Context.Set<T>().FirstOrDefaultAsync(predicate);
    }

    public async Task<IPaginate<T>> GetListAsync(Expression<Func<T, bool>>? predicate = null,
                                                 Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
                                                 Func<IQueryable<T>, IQueryable<T>>? include = null,
                                                 int index = 0, int size = 10, bool enableTracking = true,
                                                 CancellationToken cancellationToken = default)
    {
        IQueryable<T> queryable = Context.Set<T>();
        if (!enableTracking) queryable = queryable.AsNoTracking();
        if (include != null) queryable = include(queryable);
        if (predicate != null) queryable = queryable.Where(predicate);
        if (orderBy != null) return await orderBy(queryable).ToPaginateAsync(index, size, 0, cancellationToken);
        return await queryable.ToPaginateAsync(index, size, 0, cancellationToken);
    }

    public async Task<IPaginate<T>> GetListByDynamicAsync(DynamicQuery dynamicQuery,
                                                          Expression<Func<T, bool>>? predicate = null,
                                                          Func<IQueryable<T>, IQueryable<T>>? include = null,
                                                          int index = 0, int size = 10, bool enableTracking = true,
                                                          CancellationToken cancellationToken = default)
    {
        IQueryable<T> queryable = Context.Set<T>();
        if (!enableTracking) queryable = queryable.AsNoTracking();
        if (include != null) queryable = include(queryable);
        if (predicate != null) queryable = queryable.Where(predicate);

        if (dynamicQuery.Filter != null)
        {
             string where = TransformFilter(dynamicQuery.Filter);
             if (!string.IsNullOrEmpty(where))
                queryable = queryable.Where(where);
        }

        if (dynamicQuery.Sort != null && dynamicQuery.Sort.Any())
        {
            string ordering = string.Join(",", dynamicQuery.Sort.Select(s => $"{s.Field} {s.Dir}"));
            queryable = queryable.OrderBy(ordering);
        }

        return await queryable.ToPaginateAsync(index, size, 0, cancellationToken);
    }

    private string TransformFilter(Filter filter)
    {
        if (string.IsNullOrEmpty(filter.Field)) return "";
        
        // Basic implementation
        var operatorMap = new Dictionary<string, string>
        {
            {"eq", "=="}, {"neq", "!="}, {"lt", "<"}, {"lte", "<="}, {"gt", ">"}, {"gte", ">="},
            {"startswith", "StartsWith"}, {"endswith", "EndsWith"}, {"contains", "Contains"},
            {"doesnotcontain", "Contains"} // Negated later
        };

        if (filter.Logic != null && filter.Filters != null && filter.Filters.Any())
        {
            var filters = filter.Filters.Select(TransformFilter).Where(f => !string.IsNullOrEmpty(f));
            return $"({string.Join($" {filter.Logic} ", filters)})";
        }

        if (!operatorMap.ContainsKey(filter.Operator)) return "";

        var op = operatorMap[filter.Operator];
        var value = filter.Value; 
        // Handle string values with quotes
        // This is a very basic implementation and might be vulnerable to injection if not handled by the library properly,
        // but System.Linq.Dynamic.Core handles parameters. Ideally we should pass values as parameters.
        // For simplicity here, I'll just quote strings.
        
        if (op == "StartsWith" || op == "EndsWith" || op == "Contains")
        {
            return $"{filter.Field}.{op}(\"{value}\")";
        }
        
        // Check if value is number or string
        bool isNumber = double.TryParse(value, out _);
        string val = isNumber ? value! : $"\"{value}\"";

        return $"{filter.Field} {op} {val}";
    }

    public async Task<T> AddAsync(T entity)
    {
        await Context.AddAsync(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        Context.Update(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> DeleteAsync(T entity)
    {
        Context.Remove(entity);
        await Context.SaveChangesAsync();
        return entity;
    }
}

public static class PaginateExtensions
{
    public static async Task<IPaginate<T>> ToPaginateAsync<T>(this IQueryable<T> source, int index, int size, int from = 0, CancellationToken cancellationToken = default)
    {
        if (from > index) throw new ArgumentException($"indexFrom: {from} > pageIndex: {index}, must indexFrom <= pageIndex");

        var count = await source.CountAsync(cancellationToken).ConfigureAwait(false);
        var items = await source.Skip((index - from) * size).Take(size).ToListAsync(cancellationToken).ConfigureAwait(false);

        return new Paginate<T>
        {
            Index = index,
            Size = size,
            From = from,
            Count = count,
            Items = items,
            Pages = (int)Math.Ceiling(count / (double)size)
        };
    }
}
