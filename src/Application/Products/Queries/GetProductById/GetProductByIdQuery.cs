using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;
