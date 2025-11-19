using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

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
