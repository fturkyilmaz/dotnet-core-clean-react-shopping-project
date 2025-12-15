using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Constants;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = FindProductById(request.Id);

        Guard.Against.NotFound(request.Id, entity);

        UpdateEntity(entity!, request);

        await _context.SaveChangesAsync(cancellationToken);
    }

    private Product? FindProductById(int id) => _context.Products.FirstOrDefault(p => p.Id == id);

    private static void UpdateEntity(Product entity, UpdateProductCommand request)
    {
        entity.Title = request.Title ?? entity.Title;
        entity.Price = request.Price;
        entity.Description = request.Description ?? entity.Description;
        entity.Image = request.Image ?? entity.Image;
        entity.Category = request.Category ?? entity.Category;
    }
}
