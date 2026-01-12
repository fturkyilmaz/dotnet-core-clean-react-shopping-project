using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Specifications;

namespace ShoppingProject.Infrastructure.Repositories;

/// <summary>
/// Evaluates specification patterns and applies them to IQueryable expressions.
/// Handles filtering, includes, ordering, pagination, search, and tracking configuration.
/// </summary>
/// <typeparam name="T">The entity type being queried.</typeparam>
public static class SpecificationEvaluator<T>
    where T : class
{
    /// <summary>
    /// Gets the compiled query from a specification.
    /// </summary>
    /// <param name="inputQuery">The base queryable.</param>
    /// <param name="specification">The specification to apply.</param>
    /// <returns>The compiled IQueryable with all specification rules applied.</returns>
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> specification)
    {
        var query = inputQuery;

        // Apply read-only (no-tracking) if specified
        if (specification.IsReadOnly)
        {
            query = query.AsNoTracking();
        }

        // Apply criteria (WHERE clause)
        if (specification.Criteria != null)
        {
            query = query.Where(specification.Criteria);
        }

        // Apply search (full-text search across multiple properties)
        if (!string.IsNullOrWhiteSpace(specification.SearchTerm) && specification.SearchProperties.Count > 0)
        {
            query = ApplySearch(query, specification.SearchTerm, specification.SearchProperties);
        }

        // Apply includes (eager loading navigation properties)
        query = specification.Includes.Aggregate(
            query,
            (current, include) => current.Include(include)
        );

        // Apply string-based includes for complex paths
        query = specification.IncludeStrings.Aggregate(
            query,
            (current, include) => current.Include(include)
        );

        // Apply primary ordering
        if (specification.OrderBy != null)
        {
            query = query.OrderBy(specification.OrderBy);
        }
        else if (specification.OrderByDescending != null)
        {
            query = query.OrderByDescending(specification.OrderByDescending);
        }

        // Apply secondary ordering (ThenBy/ThenByDescending)
        if (specification.OrderBy != null || specification.OrderByDescending != null)
        {
            foreach (var (keySelector, isDescending) in specification.ThenByExpressions)
            {
                query = isDescending
                    ? ((IOrderedQueryable<T>)query).ThenByDescending(keySelector)
                    : ((IOrderedQueryable<T>)query).ThenBy(keySelector);
            }
        }

        // Apply paging
        if (specification.IsPagingEnabled)
        {
            query = query.Skip(specification.Skip).Take(specification.Take);
        }

        return query;
    }

    /// <summary>
    /// Applies full-text search across multiple string properties.
    /// Uses case-insensitive contains comparison.
    /// </summary>
    private static IQueryable<T> ApplySearch(
        IQueryable<T> query,
        string searchTerm,
        List<Expression<Func<T, string>>> searchProperties)
    {
        if (string.IsNullOrWhiteSpace(searchTerm) || searchProperties.Count == 0)
        {
            return query;
        }

        var parameter = Expression.Parameter(typeof(T));
        Expression? searchExpression = null;

        foreach (var property in searchProperties)
        {
            var propertyExpression = Expression.Invoke(property, parameter);

            var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) });
            var searchTermConstant = Expression.Constant(searchTerm);
            var containsExpression = Expression.Call(propertyExpression, containsMethod!, searchTermConstant);

            searchExpression = searchExpression == null
                ? containsExpression
                : Expression.Or(searchExpression, containsExpression);
        }

        if (searchExpression == null)
        {
            return query;
        }

        var lambda = Expression.Lambda<Func<T, bool>>(searchExpression, parameter);
        return query.Where(lambda);
    }
}
