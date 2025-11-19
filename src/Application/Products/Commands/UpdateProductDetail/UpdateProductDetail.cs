using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Application.Products.Commands.UpdateProductDetail;

public record UpdateProductDetailCommand : IRequest
{
    public int Id { get; init; }

    public int ListId { get; init; }

    public PriorityLevel Priority { get; init; }

    public string? Note { get; init; }
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
        var entity = await _context.Products
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Title = request.Title;
        entity.Price = request.Price;
        entity.Description = request.Description;
        entity.Image = request.Image;
        entity.Category = request.Category;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
