using MediatR;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Carts.Commands.DeleteCart;

public class DeleteCartCommandHandler : IRequestHandler<DeleteCartCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCartCommand request, CancellationToken cancellationToken)
    {
        var entity = _context.Carts.FirstOrDefault(c => c.Id == request.Id);

        if (entity == null)
        {
            throw new NotFoundException(nameof(CartDto), request.Id);
        }

        _context.Remove(entity);

        entity.AddDomainEvent(new CartDeletedEvent(entity));

        await _context.SaveChangesAsync(cancellationToken);
    }
}
