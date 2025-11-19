using System;
using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Entities
{
    public class Product: BaseAuditableEntity
    {
        public string Title { get; set; } = "";
        public decimal Price { get; set; }
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";
        public string Image { get; set; } = "";
        public Rating Rating { get; set; } = new Rating();
    }

    public class Rating
    {
        public double Rate { get; set; }
        public int Count { get; set; }
    }
}