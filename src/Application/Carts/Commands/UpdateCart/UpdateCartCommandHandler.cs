using MediatR;
using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Carts.Commands.UpdateCart;

public class UpdateCartCommandHandler : IRequestHandler<UpdateCartCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCartCommand request, CancellationToken cancellationToken)
    {
        var entity = _context.Carts.FirstOrDefault(c => c.Id == request.Id);

        if (entity == null)
        {
            throw new NotFoundException(nameof(entity), request.Id);
        }

        entity.Title = request.Title;
        entity.Price = request.Price;
        entity.Image = request.Image;
        entity.Quantity = request.Quantity;

        entity.AddDomainEvent(new CartUpdatedEvent(entity));

        await _context.SaveChangesAsync(cancellationToken);
    }
}
