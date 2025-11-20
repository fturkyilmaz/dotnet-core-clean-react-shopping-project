namespace ShoppingProject.Domain.Events;

public class CartUpdatedEvent : BaseEvent
{
    public CartUpdatedEvent(Cart item)
    {
        Item = item;
    }

    public Cart Item { get; }
}
