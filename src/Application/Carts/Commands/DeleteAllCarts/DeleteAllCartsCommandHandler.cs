using MediatR;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Application.Carts.Commands.DeleteAllCarts;

public class DeleteAllCartsCommandHandler : IRequestHandler<DeleteAllCartsCommand>
{
    private readonly ICartRepository _cartRepository;

    public DeleteAllCartsCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task Handle(DeleteAllCartsCommand request, CancellationToken cancellationToken)
    {
        await _cartRepository.DeleteAllAsync(cancellationToken);
    }
}
