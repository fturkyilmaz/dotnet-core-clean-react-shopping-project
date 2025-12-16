using MediatR;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

/// <summary>
/// Command for updating an existing product.
/// </summary>
[Authorize(Policy = Policies.CanManageProducts)]
public record UpdateProductCommand(
    int Id,
    string? Title,
    decimal Price,
    string? Description,
    string? Image,
    string? Category
) : IRequest;
