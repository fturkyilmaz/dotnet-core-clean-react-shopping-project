using ShoppingProject.Application.Common.Interfaces;
using Ardalis.GuardClauses;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Application.Products.Commands.UpdateProductDetail;

[Authorize(Policy = Policies.CanManageProducts)]
public record UpdateProductDetailCommand : IRequest
{
    public int Id { get; init; }
    public string? Title { get; init; }
    public decimal Price { get; init; }
    public string? Description { get; init; }
    public string? Category { get; init; }
    public string? Image { get; init; }
}

public class UpdateProductDetailCommandHandler : IRequestHandler<UpdateProductDetailCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductDetailCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateProductDetailCommand request, CancellationToken cancellationToken)
    {
        var entity = _context.Products
            .FirstOrDefault(p => p.Id == request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity.Title = request.Title ?? "";
        entity.Price = request.Price;
        entity.Description = request.Description ?? "";
        entity.Image = request.Image ?? "";
        entity.Category = request.Category ?? "";

        await _context.SaveChangesAsync(cancellationToken);
    }
}
