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

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = Product.Create(
            request.Title ?? string.Empty,
            request.Price,
            request.Description ?? string.Empty,
            request.Category ?? string.Empty,
            request.Image ?? string.Empty
        );

        _context.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
