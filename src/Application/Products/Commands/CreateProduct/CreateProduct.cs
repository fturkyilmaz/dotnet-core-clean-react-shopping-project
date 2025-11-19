using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Products.Commands.CreateProduct;

public record CreateProductCommand : IRequest<int>
{
    public int ListId { get; init; }

    public string? Title { get; init; }
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
            Title = request.Title,
            Done = false
        };

        entity.AddDomainEvent(new ProductCreatedEvent(entity));

        _context.Products.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
