using ShoppingProject.Application.Common.Interfaces;
using Ardalis.GuardClauses;
using MediatR;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Carts.Commands.UpdateCart;

public record UpdateCartCommand : IRequest
{
    public int Id { get; init; }
    public string Title { get; init; } = "";
    public decimal Price { get; init; }
    public string Image { get; init; } = "";
    public int Quantity { get; init; }
}

public class UpdateCartCommandHandler : IRequestHandler<UpdateCartCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateCartCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Carts
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Title = request.Title;
        entity.Price = request.Price;
        entity.Image = request.Image;
        entity.Quantity = request.Quantity;

        entity.AddDomainEvent(new CartUpdatedEvent(entity)); // Event to be created later

        await _context.SaveChangesAsync(cancellationToken);
    }
}
