using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = FindProductById(request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity!.UpdateDetails(
            request.Title ?? entity.Title,
            request.Description ?? entity.Description,
            request.Category ?? entity.Category,
            request.Image ?? entity.Image
        );

        entity.UpdatePrice(request.Price);

        await _context.SaveChangesAsync(cancellationToken);
    }

    private Product? FindProductById(int id) => _context.Products.FirstOrDefault(p => p.Id == id);
}
