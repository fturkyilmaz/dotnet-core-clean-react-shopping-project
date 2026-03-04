using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Commands.CreateProduct;

/// <summary>
/// Handler for creating a new product using UnitOfWork pattern.
/// </summary>
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var entity = Product.Create(
                request.Title ?? string.Empty,
                request.Price,
                request.Description ?? string.Empty,
                request.Category ?? string.Empty,
                request.Image ?? string.Empty
            );

            _unitOfWork.Repository<Product>().Add(entity);

            // SaveChanges is called by ExecuteInTransactionAsync upon commit
            return entity.Id;
        }, cancellationToken);
    }
}
