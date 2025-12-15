using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Products.Commands.UpdateProductDetail;

[Authorize(Policy = Policies.CanManageProducts)]
public record UpdateProductDetailCommand : IRequest
{
    public int Id { get; init; }
    public string? Title { get; init; }
    public decimal Price { get; init; }
    public string? Description { get; init; }
    public string? Category { get; init; }
    public string? Image { get; init; }
}
