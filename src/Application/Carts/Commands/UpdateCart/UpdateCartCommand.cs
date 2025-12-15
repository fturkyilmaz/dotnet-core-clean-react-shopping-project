using MediatR;
using ShoppingProject.Application.Common.Security;

namespace ShoppingProject.Application.Carts.Commands.UpdateCart;

[Authorize]
public record UpdateCartCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string Image { get; init; } = string.Empty;
    public int Quantity { get; init; }
}
