using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Enums;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Products.Commands.DeleteProduct;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var entity = _context.Products.FirstOrDefault(p => p.Id == request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity!.UpdateStatus(
            EntityStatus.Deleted
        );

        entity.RemoveDomainEvent(new ProductDeletedEvent(entity));

        await _context.SaveChangesAsync(cancellationToken);
    }

}
