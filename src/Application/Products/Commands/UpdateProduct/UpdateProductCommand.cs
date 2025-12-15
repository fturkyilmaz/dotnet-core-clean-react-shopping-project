using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

[Authorize(Policy = Policies.CanManageProducts)]
public record UpdateProductCommand : IRequest
{
    public int Id { get; init; }

    public string? Title { get; init; }

    public decimal Price { get; init; }

    public string? Description { get; init; }

    public string? Image { get; init; }

    public string? Category { get; init; }
}
