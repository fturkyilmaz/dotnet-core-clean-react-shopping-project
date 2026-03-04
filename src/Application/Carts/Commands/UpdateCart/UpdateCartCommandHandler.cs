using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Carts.Commands.UpdateCart;

/// <summary>
/// Handler for updating a cart item using UnitOfWork pattern.
/// </summary>
public class UpdateCartCommandHandler : IRequestHandler<UpdateCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task Handle(UpdateCartCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var entity = await _unitOfWork.Repository<Cart>().GetByIdAsync(request.Id, cancellationToken);
            Guard.Against.NotFound(request.Id, entity);

            // Update details using domain behavior
            entity!.UpdateDetails(request.Title, request.Price, request.Image);

            // Update quantity separately to track quantity changes
            if (entity.Quantity != request.Quantity)
            {
                entity.UpdateQuantity(request.Quantity);
            }

            _unitOfWork.Repository<Cart>().Update(entity);
        }, cancellationToken);
    }
}
