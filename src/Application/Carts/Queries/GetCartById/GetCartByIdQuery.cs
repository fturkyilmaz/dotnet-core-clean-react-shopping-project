using MediatR;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Carts.Queries.GetCartById;

public record GetCartByIdQuery(int Id) : IRequest<CartDto>;
