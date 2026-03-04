using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Carts.Commands.CreateCart;

/// <summary>
/// Handler for creating a new cart item using UnitOfWork pattern.
/// </summary>
public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, int>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<int> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var entity = Cart.Create(
                request.Title,
                request.Price,
                request.Image ?? string.Empty,
                request.Quantity,
                request.OwnerId
            );

            _unitOfWork.Repository<Cart>().Add(entity);

            return entity.Id;
        }, cancellationToken);
    }
}
