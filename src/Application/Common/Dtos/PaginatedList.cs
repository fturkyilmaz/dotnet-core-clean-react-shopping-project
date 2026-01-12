namespace ShoppingProject.Application.Common.Dtos;

/// <summary>
/// Represents a list of items with pagination information.
/// </summary>
/// <typeparam name="T">The type of items in the list.</typeparam>
public sealed class PaginatedList<T>
{
    public PaginatedList(
        List<T> items,
        int pageIndex,
        int pageSize,
        int totalCount)
    {
        Items = items ?? new List<T>();
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = totalCount;
    }

    /// <summary>
    /// Gets the items in the current page.
    /// </summary>
    public List<T> Items { get; }

    /// <summary>
    /// Gets the zero-based page index.
    /// </summary>
    public int PageIndex { get; }

    /// <summary>
    /// Gets the number of items per page.
    /// </summary>
    public int PageSize { get; }

    /// <summary>
    /// Gets the total number of items across all pages.
    /// </summary>
    public int TotalCount { get; }

    /// <summary>
    /// Gets the total number of pages.
    /// </summary>
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;

    /// <summary>
    /// Gets a value indicating whether this is not the first page.
    /// </summary>
    public bool HasPreviousPage => PageIndex > 0;

    /// <summary>
    /// Gets a value indicating whether there are more pages after this one.
    /// </summary>
    public bool HasNextPage => PageIndex < TotalPages - 1;

    /// <summary>
    /// Gets the 1-based page number.
    /// </summary>
    public int PageNumber => PageIndex + 1;

    /// <summary>
    /// Creates a paginated list from query results.
    /// </summary>
    public static PaginatedList<T> CreateFromQuery(
        List<T> items,
        int pageIndex,
        int pageSize,
        int totalCount) =>
        new(items, pageIndex, pageSize, totalCount);
}
