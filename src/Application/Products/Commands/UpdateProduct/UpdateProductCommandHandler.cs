using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

/// <summary>
/// Handler for updating a product using UnitOfWork pattern.
/// </summary>
public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProductCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var entity = await _unitOfWork.Repository<Product>().GetByIdAsync(request.Id, cancellationToken);
            Guard.Against.NotFound(request.Id, entity);

            entity!.UpdateDetails(
                request.Title ?? entity.Title,
                request.Description ?? entity.Description,
                request.Category ?? entity.Category,
                request.Image ?? entity.Image
            );

            entity.UpdatePrice(request.Price);

            _unitOfWork.Repository<Product>().Update(entity);
        }, cancellationToken);
    }
}
