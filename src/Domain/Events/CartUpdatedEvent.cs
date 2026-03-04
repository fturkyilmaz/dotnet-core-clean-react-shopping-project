using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

/// <summary>
/// Event raised when a cart item is updated.
/// </summary>
public class CartUpdatedEvent : BaseEvent
{
    public CartUpdatedEvent(int cartId, string title, decimal price, int quantity)
    {
        CartId = cartId;
        Title = title;
        Price = price;
        Quantity = quantity;
    }

    public int CartId { get; }
    public string Title { get; }
    public decimal Price { get; }
    public int Quantity { get; }
}
