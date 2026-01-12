using System.Linq.Expressions;

namespace ShoppingProject.Application.Common.Specifications;

/// <summary>
/// Interface for implementing the Specification pattern.
/// Provides a contract for query composition in domain-driven design.
/// </summary>
/// <typeparam name="T">The entity type this specification applies to.</typeparam>
public interface ISpecification<T>
    where T : class
{
    /// <summary>
    /// Gets the filter criteria for the specification.
    /// </summary>
    Expression<Func<T, bool>>? Criteria { get; }

    /// <summary>
    /// Gets the collection of navigation properties to eagerly load.
    /// </summary>
    List<Expression<Func<T, object>>> Includes { get; }

    /// <summary>
    /// Gets the collection of string-based navigation properties to eagerly load.
    /// </summary>
    List<string> IncludeStrings { get; }

    /// <summary>
    /// Gets the primary sort expression (ascending).
    /// </summary>
    Expression<Func<T, object>>? OrderBy { get; }

    /// <summary>
    /// Gets the primary sort expression (descending).
    /// </summary>
    Expression<Func<T, object>>? OrderByDescending { get; }

    /// <summary>
    /// Gets the secondary sort expressions.
    /// </summary>
    List<(Expression<Func<T, object>> KeySelector, bool IsDescending)> ThenByExpressions { get; }

    /// <summary>
    /// Gets the number of records to take (for pagination).
    /// </summary>
    int Take { get; }

    /// <summary>
    /// Gets the number of records to skip (for pagination).
    /// </summary>
    int Skip { get; }

    /// <summary>
    /// Gets a value indicating whether pagination is enabled.
    /// </summary>
    bool IsPagingEnabled { get; }

    /// <summary>
    /// Gets the search term for full-text search queries.
    /// </summary>
    string? SearchTerm { get; }

    /// <summary>
    /// Gets the search properties to use for full-text search.
    /// </summary>
    List<Expression<Func<T, string>>> SearchProperties { get; }

    /// <summary>
    /// Gets a value indicating whether to disable query tracking.
    /// </summary>
    bool IsReadOnly { get; }
}

