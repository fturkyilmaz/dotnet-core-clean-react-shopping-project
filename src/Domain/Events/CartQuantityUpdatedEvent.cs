using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

/// <summary>
/// Event raised when a cart item's quantity is updated.
/// </summary>
public class CartQuantityUpdatedEvent : BaseEvent
{
    public CartQuantityUpdatedEvent(int cartId, int oldQuantity, int newQuantity)
    {
        CartId = cartId;
        OldQuantity = oldQuantity;
        NewQuantity = newQuantity;
    }

    public int CartId { get; }
    public int OldQuantity { get; }
    public int NewQuantity { get; }
}
