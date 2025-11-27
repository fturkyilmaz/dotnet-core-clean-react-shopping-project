using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

public sealed class CartItemAddedEvent : BaseEvent
{
    public CartItemAddedEvent(int cartId, int productId, int quantity)
    {
        CartId = cartId;
        ProductId = productId;
        Quantity = quantity;
    }

    public int CartId { get; }
    public int ProductId { get; }
    public int Quantity { get; }
}

public sealed class CartItemRemovedEvent : BaseEvent
{
    public CartItemRemovedEvent(int cartId, int productId)
    {
        CartId = cartId;
        ProductId = productId;
    }

    public int CartId { get; }
    public int ProductId { get; }
}

public sealed class CartItemQuantityChangedEvent : BaseEvent
{
    public CartItemQuantityChangedEvent(int cartId, int productId, int oldQuantity, int newQuantity)
    {
        CartId = cartId;
        ProductId = productId;
        OldQuantity = oldQuantity;
        NewQuantity = newQuantity;
    }

    public int CartId { get; }
    public int ProductId { get; }
    public int OldQuantity { get; }
    public int NewQuantity { get; }
}

public sealed class CartClearedEvent : BaseEvent
{
    public CartClearedEvent(int cartId)
    {
        CartId = cartId;
    }

    public int CartId { get; }
}
