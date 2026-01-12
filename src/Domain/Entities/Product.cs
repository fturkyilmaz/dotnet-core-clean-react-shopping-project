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
            AddDomainEvent(new ProductRatingUpdatedEvent(Id, Rating.Rate, Rating.Count));
        }

        public void UpdateStatus(EntityStatus newStatus)
        {
            Status = newStatus;
            AddDomainEvent(new ProductStatusChangedEvent(Id, newStatus));
        }
    }
}
