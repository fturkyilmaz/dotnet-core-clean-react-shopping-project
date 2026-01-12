namespace ShoppingProject.Application.Common.Dtos;

/// <summary>
/// Represents a paginated response containing a page of data along with pagination metadata.
/// </summary>
/// <typeparam name="T">The type of items in the page.</typeparam>
public sealed class PaginatedResponse<T>
{
    public PaginatedResponse(
        List<T> items,
        int pageIndex,
        int pageSize,
        int totalCount,
        string? orderBy = null)
    {
        Items = items ?? new List<T>();
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = totalCount;
        OrderBy = orderBy;
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
    /// Gets the order by expression used for this page.
    /// </summary>
    public string? OrderBy { get; }

    /// <summary>
    /// Gets the total number of pages.
    /// </summary>
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;

    /// <summary>
    /// Gets a value indicating whether this is the first page.
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
    /// Creates a paginated response from a PaginatedList.
    /// </summary>
    public static PaginatedResponse<T> From(PaginatedList<T> paginatedList) =>
        new(
            paginatedList.Items,
            paginatedList.PageIndex,
            paginatedList.PageSize,
            paginatedList.TotalCount,
            null);

    /// <summary>
    /// Creates a paginated response from individual parameters.
    /// </summary>
    public static PaginatedResponse<T> Create(
        List<T> items,
        int pageIndex,
        int pageSize,
        int totalCount,
        string? orderBy = null) =>
        new(items, pageIndex, pageSize, totalCount, orderBy);
}
