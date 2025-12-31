namespace ShoppingProject.Domain.Events;

public class ProductDeletedEvent : BaseEvent
{
    public ProductDeletedEvent(Product item)
    {
        Item = item;
    }

    public Product Item { get; }
}
