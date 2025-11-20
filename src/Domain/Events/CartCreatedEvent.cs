namespace ShoppingProject.Domain.Events;

public class CartCreatedEvent : BaseEvent
{
    public CartCreatedEvent(Cart item)
    {
        Item = item;
    }

    public Cart Item { get; }
}
