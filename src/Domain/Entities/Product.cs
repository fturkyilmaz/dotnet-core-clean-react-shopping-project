using System;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.ValueObjects;

namespace ShoppingProject.Domain.Entities
{
    public class Product : BaseAuditableEntity
    {
        public string Title { get; private set; } = string.Empty;
        public decimal Price { get; private set; }
        public string Description { get; private set; } = string.Empty;
        public string Category { get; private set; } = string.Empty;
        public string Image { get; private set; } = string.Empty;
        public Rating Rating { get; private set; } = new(0, 0);

        public static Product Create(
            string title,
            decimal price,
            string description,
            string category,
            string image
        )
        {
            var product = new Product
            {
                Title = title,
                Price = price,
                Description = description,
                Category = category,
                Image = image,
                Rating = new Rating(0, 0),
            };

            product.AddDomainEvent(new ProductCreatedEvent(product));

            return product;
        }

        public void UpdateDetails(string title, string description, string category, string image)
        {
            Title = title;
            Description = description;
            Category = category;
            Image = image;

            AddDomainEvent(new ProductUpdatedEvent(Id, Title));
        }

        public void UpdatePrice(decimal newPrice)
        {
            if (newPrice != Price)
            {
                AddDomainEvent(new ProductPriceChangedEvent(Id, Price, newPrice));
                Price = newPrice;
            }
        }

        public void UpdateRating(Rating newRating)
        {
            Rating = newRating;
            // Assuming we might want an event here too, but staying strictly to plan for now.
            // Actually ProductRatingUpdatedEvent exists in ProductEvents.cs, let's use it if we had the params.
            // But Rating value object encapsulates rate/count. Let's just set it for now or check if we need to emit.
            // The existing ProductRatingUpdatedEvent takes (int productId, double newRating, int totalRatings).
            AddDomainEvent(new ProductRatingUpdatedEvent(Id, Rating.Rate, Rating.Count));
        }
    }
}
