using ShoppingProject.Application.Common.Behaviours;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProducts;

[Cacheable("products", durationMinutes: 10)]
public record GetProductsQuery : IRequest<IEnumerable<ProductDto>>;
