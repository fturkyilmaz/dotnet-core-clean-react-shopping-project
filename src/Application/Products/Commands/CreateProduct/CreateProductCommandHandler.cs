using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Security;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.ValueObjects;

namespace ShoppingProject.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    private static Product CreateProductFromRequest(CreateProductCommand request)
    {
        return new Product
        {
            Title = request.Title ?? string.Empty,
            Price = request.Price,
            Description = request.Description ?? string.Empty,
            Category = request.Category ?? string.Empty,
            Image = request.Image ?? string.Empty,
            Rating = new Rating(0.0, 0),
        };
    }

    private static void AddDomainEvents(Product entity)
    {
        entity.AddDomainEvent(new ProductCreatedEvent(entity));
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = CreateProductFromRequest(request);

        AddDomainEvents(entity);

        _context.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
