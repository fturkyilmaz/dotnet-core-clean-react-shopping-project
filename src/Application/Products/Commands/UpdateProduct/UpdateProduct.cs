using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;
using Ardalis.GuardClauses;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

[Authorize(Policy = Policies.CanManageProducts)]
public record UpdateProductCommand : IRequest
{
    public int Id { get; init; }

    public string? Title { get; init; }

    public decimal Price { get; init; }

    public string? Description { get; init; }

    public string? Image { get; init; }

    public string? Category { get; init; }
}

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = _context.Products
            .FirstOrDefault(p => p.Id == request.Id);

        Guard.Against.NotFound(request.Id, entity);

        entity.Title = request.Title ?? entity.Title;
        entity.Price = request.Price;
        entity.Description = request.Description ?? entity.Description;
        entity.Image = request.Image ?? entity.Image;
        entity.Category = request.Category ?? entity.Category;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
