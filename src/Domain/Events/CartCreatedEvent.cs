using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

/// <summary>
/// Event raised when a new cart item is created.
/// </summary>
public class CartCreatedEvent : BaseEvent
{
    public CartCreatedEvent(int cartId, string title, decimal price, int quantity, string ownerId)
    {
        CartId = cartId;
        Title = title;
        Price = price;
        Quantity = quantity;
        OwnerId = ownerId;
    }

    public int CartId { get; }
    public string Title { get; }
    public decimal Price { get; }
    public int Quantity { get; }
    public string OwnerId { get; }
}
