using MediatR;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Carts.Queries.GetCarts;

public record GetCartsQuery : IRequest<List<CartDto>>;
