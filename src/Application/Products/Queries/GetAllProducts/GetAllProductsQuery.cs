using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetAllProducts;

public record GetAllProductsQuery : IRequest<IEnumerable<AdminProductDto>>;
