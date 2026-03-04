using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Carts.Commands.DeleteCart;

/// <summary>
/// Handler for deleting a cart item using UnitOfWork pattern.
/// </summary>
public class DeleteCartCommandHandler : IRequestHandler<DeleteCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task Handle(DeleteCartCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var entity = await _unitOfWork.Repository<Cart>().GetByIdAsync(request.Id, cancellationToken);
            Guard.Against.NotFound(request.Id, entity);

            // Use domain behavior for deletion (raises domain event)
            entity!.MarkAsDeleted();

            _unitOfWork.Repository<Cart>().Update(entity);
        }, cancellationToken);
    }
}
