using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

public class ProductAddedEvent : BaseEvent
{
    public ProductAddedEvent(Product item)
    {
        Item = item;
    }

    public Product Item { get; }
}