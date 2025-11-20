using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

public class ProductCreatedEvent : BaseEvent
{
    public ProductCreatedEvent(Product item)
    {
        Item = item;
    }

    public Product Item { get; }
}
