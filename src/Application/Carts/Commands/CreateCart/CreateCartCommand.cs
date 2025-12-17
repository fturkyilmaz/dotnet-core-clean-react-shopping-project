using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Carts.Commands.CreateCart;

/// <summary> /// Command for creating a new cart. /// </summary>
[Authorize(Policy = Policies.CanManageClients)]
public record CreateCartCommand : IRequest<int>
{
    public int? OwnerId { get; init; }
    public int Quantity { get; init; }
    public string Title { get; init; } = default!;
    public decimal Price { get; init; }
    public string? Image { get; init; }
}
