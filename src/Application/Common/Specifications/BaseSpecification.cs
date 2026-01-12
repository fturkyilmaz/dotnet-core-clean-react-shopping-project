using System.Linq.Expressions;

namespace ShoppingProject.Application.Common.Specifications;

/// <summary>
/// Base class for implementing the Specification pattern in Domain-Driven Design.
/// Provides a reusable way to compose query logic.
/// </summary>
/// <typeparam name="T">The entity type this specification applies to.</typeparam>
public abstract class BaseSpecification<T> : ISpecification<T>
    where T : class
{
    protected BaseSpecification() { }

    protected BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    /// <summary>
    /// Gets or sets the filter criteria for the specification.
    /// </summary>
    public Expression<Func<T, bool>>? Criteria { get; protected set; }

    /// <summary>
    /// Gets the collection of navigation properties to eagerly load using Include().
    /// </summary>
    public List<Expression<Func<T, object>>> Includes { get; } = new();

    /// <summary>
    /// Gets the collection of string-based navigation properties to eagerly load.
    /// Useful for complex navigation paths like "Orders.OrderItems".
    /// </summary>
    public List<string> IncludeStrings { get; } = new();

    /// <summary>
    /// Gets or sets the primary sort expression (ascending order).
    /// </summary>
    public Expression<Func<T, object>>? OrderBy { get; protected set; }

    /// <summary>
    /// Gets or sets the primary sort expression (descending order).
    /// </summary>
    public Expression<Func<T, object>>? OrderByDescending { get; protected set; }

    /// <summary>
    /// Gets or sets the secondary sort expressions.
    /// Allows multiple sort clauses via ThenBy and ThenByDescending.
    /// </summary>
    public List<(Expression<Func<T, object>> KeySelector, bool IsDescending)> ThenByExpressions { get; } = new();

    /// <summary>
    /// Gets the number of records to skip (for pagination).
    /// </summary>
    public int Take { get; protected set; }

    /// <summary>
    /// Gets the number of records to skip (for pagination).
    /// </summary>
    public int Skip { get; protected set; }

    /// <summary>
    /// Gets a value indicating whether pagination is enabled.
    /// </summary>
    public bool IsPagingEnabled { get; protected set; }

    /// <summary>
    /// Gets or sets the search term for full-text search queries.
    /// </summary>
    public string? SearchTerm { get; protected set; }

    /// <summary>
    /// Gets the search properties to use for full-text search.
    /// </summary>
    public List<Expression<Func<T, string>>> SearchProperties { get; } = new();

    /// <summary>
    /// Gets a value indicating whether to disable query tracking (read-only queries).
    /// </summary>
    public bool IsReadOnly { get; protected set; }

    /// <summary>
    /// Adds an include clause for eager loading a navigation property.
    /// </summary>
    protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    /// <summary>
    /// Adds a string-based include clause for eager loading complex navigation paths.
    /// </summary>
    protected virtual void AddInclude(string includeString)
    {
        IncludeStrings.Add(includeString);
    }

    /// <summary>
    /// Applies pagination to the query.
    /// </summary>
    /// <param name="skip">The number of records to skip (0-based).</param>
    /// <param name="take">The number of records to take.</param>
    protected virtual void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }

    /// <summary>
    /// Applies ascending order to the query.
    /// </summary>
    protected virtual void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }

    /// <summary>
    /// Applies descending order to the query.
    /// </summary>
    protected virtual void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        OrderByDescending = orderByDescExpression;
    }

    /// <summary>
    /// Adds a secondary sort clause to the query.
    /// </summary>
    protected virtual void AddThenBy(Expression<Func<T, object>> thenByExpression, bool descending = false)
    {
        ThenByExpressions.Add((thenByExpression, descending));
    }

    /// <summary>
    /// Sets the search term for full-text search queries.
    /// </summary>
    protected virtual void ApplySearch(string? searchTerm, params Expression<Func<T, string>>[] searchProperties)
    {
        SearchTerm = searchTerm;
        SearchProperties.Clear();

        if (!string.IsNullOrWhiteSpace(searchTerm) && searchProperties.Length > 0)
        {
            foreach (var property in searchProperties)
            {
                SearchProperties.Add(property);
            }
        }
    }

    /// <summary>
    /// Marks the specification as read-only (disables query tracking in EF Core).
    /// Useful for query-only operations to improve performance.
    /// </summary>
    protected virtual void ApplyReadOnly()
    {
        IsReadOnly = true;
    }

    /// <summary>
    /// Adds multiple filter criteria using AND logic.
    /// </summary>
    protected void AndCriteria(Expression<Func<T, bool>> additionalCriteria)
    {
        if (Criteria == null)
        {
            Criteria = additionalCriteria;
            return;
        }

        var parameter = Expression.Parameter(typeof(T));
        var invokedCriteria = Expression.Invoke(Criteria, parameter);
        var invokedAdditional = Expression.Invoke(additionalCriteria, parameter);
        var combined = Expression.And(invokedCriteria, invokedAdditional);
        var lambda = Expression.Lambda<Func<T, bool>>(combined, parameter);

        Criteria = lambda;
    }

    /// <summary>
    /// Replaces the current filter criteria with new criteria using OR logic.
    /// </summary>
    protected void OrCriteria(Expression<Func<T, bool>> additionalCriteria)
    {
        if (Criteria == null)
        {
            Criteria = additionalCriteria;
            return;
        }

        var parameter = Expression.Parameter(typeof(T));
        var invokedCriteria = Expression.Invoke(Criteria, parameter);
        var invokedAdditional = Expression.Invoke(additionalCriteria, parameter);
        var combined = Expression.Or(invokedCriteria, invokedAdditional);
        var lambda = Expression.Lambda<Func<T, bool>>(combined, parameter);

        Criteria = lambda;
    }
}

