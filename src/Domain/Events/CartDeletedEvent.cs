using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

/// <summary>
/// Event raised when a cart item is deleted.
/// </summary>
public class CartDeletedEvent : BaseEvent
{
    public CartDeletedEvent(int cartId, string ownerId)
    {
        CartId = cartId;
        OwnerId = ownerId;
    }

    public int CartId { get; }
    public string OwnerId { get; }
}
