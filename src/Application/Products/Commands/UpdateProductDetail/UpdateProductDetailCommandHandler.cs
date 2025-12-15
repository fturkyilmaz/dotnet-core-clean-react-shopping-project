using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Application.Products.Commands.UpdateProductDetail;

public class UpdateProductDetailCommandHandler : IRequestHandler<UpdateProductDetailCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductDetailCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(
        UpdateProductDetailCommand request,
        CancellationToken cancellationToken
    )
    {
        var entity = _context.Products.FirstOrDefault(p => p.Id == request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity.UpdateDetails(
            request.Title ?? entity.Title,
            request.Description ?? entity.Description,
            request.Category ?? entity.Category,
            request.Image ?? entity.Image
        );

        entity.UpdatePrice(request.Price);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
