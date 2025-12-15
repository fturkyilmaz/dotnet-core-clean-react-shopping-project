using MediatR;
using ShoppingProject.Application.Common.Behaviours;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProductWithPagination;

public record GetProductsWithPaginationQuery : IRequest<PaginatedList<ProductDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
