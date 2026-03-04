using ShoppingProject.Application.Common.Behaviours;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProducts;

[Cacheable("products", durationMinutes: 10)]
public record GetProductsQuery : IRequest<IEnumerable<ProductDto>>
{
    public string? Category { get; init; }
    public string? SearchTerm { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public string? SortBy { get; init; }
    public string? SortOrder { get; init; }
}
