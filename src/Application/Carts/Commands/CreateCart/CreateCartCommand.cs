using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Carts.Commands.CreateCart;

/// <summary>
/// Command for creating a new cart item.
/// </summary>
[Authorize(Policy = Policies.CanManageClients)]
public record CreateCartCommand : IRequest<int>
{
    public string OwnerId { get; init; } = default!;
    public int Quantity { get; init; } = 1;
    public string Title { get; init; } = default!;
    public decimal Price { get; init; }
    public string? Image { get; init; }
}
