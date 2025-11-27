using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Events;

public sealed class ProductPriceChangedEvent : BaseEvent
{
    public ProductPriceChangedEvent(int productId, decimal oldPrice, decimal newPrice)
    {
        ProductId = productId;
        OldPrice = oldPrice;
        NewPrice = newPrice;
    }

    public int ProductId { get; }
    public decimal OldPrice { get; }
    public decimal NewPrice { get; }
}

public sealed class ProductUpdatedEvent : BaseEvent
{
    public ProductUpdatedEvent(int productId, string productName)
    {
        ProductId = productId;
        ProductName = productName;
    }

    public int ProductId { get; }
    public string ProductName { get; }
}

public sealed class ProductRatingUpdatedEvent : BaseEvent
{
    public ProductRatingUpdatedEvent(int productId, double newRating, int totalRatings)
    {
        ProductId = productId;
        NewRating = newRating;
        TotalRatings = totalRatings;
    }

    public int ProductId { get; }
    public double NewRating { get; }
    public int TotalRatings { get; }
}
