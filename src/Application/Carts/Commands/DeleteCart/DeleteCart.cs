using ShoppingProject.Application.Common.Interfaces;
using Ardalis.GuardClauses;
using MediatR;

namespace ShoppingProject.Application.Carts.Commands.DeleteCart;

public record DeleteCartCommand(int Id) : IRequest;

public class DeleteCartCommandHandler : IRequestHandler<DeleteCartCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCartCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Carts
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.Carts.Remove(entity);

        // entity.AddDomainEvent(new CartDeletedEvent(entity)); // Event to be created later

        await _context.SaveChangesAsync(cancellationToken);
    }
}
