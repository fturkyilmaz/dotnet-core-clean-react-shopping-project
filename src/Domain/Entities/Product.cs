using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.ValueObjects;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Domain.Entities;

public class Product : BaseAuditableEntity
{
    private Product() { } // EF Core için gerekli

    private Product(
        ProductTitle title,
        Money price,
        ProductDescription description,
        ProductCategory category,
        ProductImage image,
        Rating rating)
    {
        Title = title;
        Price = price;
        Description = description;
        Category = category;
        Image = image;
        Rating = rating;
    }

    public ProductTitle Title { get; private set; } = null!;
    public Money Price { get; private set; } = null!;
    public ProductDescription Description { get; private set; } = null!;
    public ProductCategory Category { get; private set; } = null!;
    public ProductImage Image { get; private set; } = null!;
    public Rating Rating { get; private set; } = null!;

    public static Result<Product> Create(
        ProductTitle title,
        Money price,
        ProductDescription description,
        ProductCategory category,
        ProductImage image)
    {
        var rating = Rating.Empty;

        var product = new Product(title, price, description, category, image, rating);
        product.AddDomainEvent(new ProductCreatedEvent(product.Id, title.Value, price.Amount));

        return Result.Success(product);
    }

    public Result UpdatePrice(Money newPrice)
    {
        if (newPrice.Amount <= 0)
            return Result.Failure("Product price must be greater than zero", ErrorType.Validation);

        var oldPrice = Price;
        Price = newPrice;

        AddDomainEvent(new ProductPriceChangedEvent(Id, oldPrice.Amount, newPrice.Amount));
        return Result.Success();
    }

    public Result UpdateDetails(
        ProductTitle? title = null,
        ProductDescription? description = null,
        ProductCategory? category = null,
        ProductImage? image = null)
    {
        var hasChanges = false;

        if (title is not null && title != Title)
        {
            Title = title;
            hasChanges = true;
        }

        if (description is not null && description != Description)
        {
            Description = description;
            hasChanges = true;
        }

        if (category is not null && category != Category)
        {
            Category = category;
            hasChanges = true;
        }

        if (image is not null && image != Image)
        {
            Image = image;
            hasChanges = true;
        }

        if (hasChanges)
        {
            AddDomainEvent(new ProductUpdatedEvent(Id, Title.Value));
        }

        return Result.Success();
    }

    public void AddRating(double newRating)
    {
        Rating = Rating.AddRating(newRating);
        AddDomainEvent(new ProductRatingUpdatedEvent(Id, Rating.Rate, Rating.Count));
    }

    // Business Rules
    public bool IsAvailable => true; // Placeholder - gerçek implementasyonda stock kontrolü yapılacak

    public bool IsInCategory(ProductCategory category) => Category == category;

    public bool HasRating => Rating.HasRatings;

    public decimal GetTotalValue(CartItemQuantity quantity) =>
        Price.Amount * quantity.Value;

    public bool CanBeUpdated()
    {
        // Business rule: Product can be updated if it exists and is not deleted
        return true; // Placeholder - gerçek implementasyonda daha kompleks logic olabilir
    }

    public bool IsPriceValid()
    {
        // Business rule: Price must be greater than zero and reasonable
        return Price.Amount > 0 && Price.Amount <= 999999.99m;
    }

    public bool IsHighRated()
    {
        // Business rule: Product is high-rated if it has rating >= 4.0 and at least 10 reviews
        return Rating.HasRatings && Rating.Rate >= 4.0 && Rating.Count >= 10;
    }

    public bool CanBeAddedToCart(CartItemQuantity requestedQuantity)
    {
        // Business rule: Product can be added to cart if available and quantity is valid
        return IsAvailable && requestedQuantity.Value > 0 && requestedQuantity.Value <= 99;
    }

    public static class BusinessRules
    {
        public const decimal MinimumPrice = 0.01m;
        public const decimal MaximumPrice = 999999.99m;
        public const int MinimumTitleLength = 1;
        public const int MaximumTitleLength = 100;
        public const int MinimumDescriptionLength = 10;
        public const int MaximumDescriptionLength = 1000;
        public const double MinimumRating = 0.0;
        public const double MaximumRating = 5.0;
        public const int HighRatingThreshold = 4;
        public const int MinimumReviewsForHighRating = 10;
    }
}