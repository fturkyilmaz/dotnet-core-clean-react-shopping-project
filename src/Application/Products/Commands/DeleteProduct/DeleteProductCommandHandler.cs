using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Application.Products.Commands.DeleteProduct;

/// <summary>
/// Handler for deleting (soft delete) a product using UnitOfWork pattern.
/// </summary>
public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var entity = await _unitOfWork.Repository<Product>().GetByIdAsync(request.Id, cancellationToken);
            Guard.Against.NotFound(request.Id, entity);

            // Soft delete - update status instead of removing
            entity!.UpdateStatus(EntityStatus.Deleted);

            _unitOfWork.Repository<Product>().Update(entity);
        }, cancellationToken);
    }
}
