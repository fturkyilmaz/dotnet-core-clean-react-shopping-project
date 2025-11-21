using ShoppingProject.Application.Common.Interfaces;
using Ardalis.GuardClauses;
using MediatR;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Carts.Commands.DeleteCart;

[Authorize]
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
        var entity = _context.Carts
            .FirstOrDefault(c => c.Id == request.Id);

        Guard.Against.NotFound(request.Id, entity);

        _context.Remove(entity);

        entity.AddDomainEvent(new CartDeletedEvent(entity)); // Event to be created later

        await _context.SaveChangesAsync(cancellationToken);
    }
}
