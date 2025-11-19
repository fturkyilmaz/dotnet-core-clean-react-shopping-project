namespace ShoppingProject.Domain.Events;

public class ProductCompletedEvent : BaseEvent
{
    public ProductCompletedEvent(Product item)
    {
        Item = item;
    }

    public Product Item { get; }
}
