using System;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.ValueObjects;

namespace ShoppingProject.Domain.Entities
{
    public class Product : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public Rating Rating { get; set; } = new(0, 0);
    }
}
