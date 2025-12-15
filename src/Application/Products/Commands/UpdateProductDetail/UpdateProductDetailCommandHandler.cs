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

        entity.Title = request.Title ?? entity.Title;
        entity.Price = request.Price;
        entity.Description = request.Description ?? entity.Description;
        entity.Image = request.Image ?? entity.Image;
        entity.Category = request.Category ?? entity.Category;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
