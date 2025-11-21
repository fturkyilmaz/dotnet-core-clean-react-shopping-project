using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Products.Commands.CreateProduct;

[Authorize(Policy = Policies.CanManageProducts)]
public record CreateProductCommand : IRequest<int>
{
    public string? Title { get; init; }
    public decimal Price { get; init; }
    public string? Description { get; init; }
    public string? Category { get; init; }
    public string? Image { get; init; }
}

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = new Product
        {
            Title = request.Title ?? "",
            Price = request.Price,
            Description = request.Description ?? "",
            Category = request.Category ?? "",
            Image = request.Image ?? "",
            Rating = new Rating()
        };

        entity.AddDomainEvent(new ProductCreatedEvent(entity));

        _context.Add<Product>(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
