using MediatR;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Products.Commands.CreateProduct;

/// <summary>
/// Command for creating a new product.
/// </summary>
[Authorize(Policy = Policies.CanManageProducts)]
public record CreateProductCommand(
    string? Title,
    decimal Price,
    string? Description,
    string? Category,
    string? Image
) : IRequest<int>;
