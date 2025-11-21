using ShoppingProject.Application.Common.Interfaces;
using Ardalis.GuardClauses;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Events;
using ShoppingProject.Application.Common.Security;

namespace ShoppingProject.Application.Products.Commands.DeleteProduct;

[Authorize(Policy = Policies.CanManageProducts)]
public record DeleteProductCommand(int Id) : IRequest;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var entity = _context.Products
            .FirstOrDefault(p => p.Id == request.Id);

        Guard.Against.NotFound(request.Id, entity);

        _context.Remove(entity);

        entity.AddDomainEvent(new ProductDeletedEvent(entity));

        await _context.SaveChangesAsync(cancellationToken);
    }

}
