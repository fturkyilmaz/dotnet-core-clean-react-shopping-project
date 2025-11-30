using MediatR;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Application.Carts.Commands.DeleteAllCarts
{
    public record DeleteAllCartsCommand : IRequest;

    public class DeleteAllCartsCommandHandler : IRequestHandler<DeleteAllCartsCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteAllCartsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteAllCartsCommand request, CancellationToken cancellationToken)
        {
            if (_context.Carts != null)
                await _context.Carts.ExecuteDeleteAsync(cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
