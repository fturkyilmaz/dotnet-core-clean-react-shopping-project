using MediatR;
using ShoppingProject.Application.Common.Security;

namespace ShoppingProject.Application.Carts.Commands.DeleteCart;

[Authorize]
public record DeleteCartCommand(int Id) : IRequest;
