using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Carts.Commands.CreateCart;

public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateCartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        var entity = new Cart
        {
            Title = request.Title,
            Price = request.Price,
            Image = request.Image ?? string.Empty,
            Quantity = request.Quantity,
        };

        entity.AddDomainEvent(new CartCreatedEvent(entity));

        _context.Add<Cart>(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
