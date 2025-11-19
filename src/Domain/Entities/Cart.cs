using System;
using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Entities
{
    public class Cart: BaseAuditableEntity
    {
        public string Title { get; set; } = "";
        public decimal Price { get; set; }
        public string Image { get; set; } = "";
        public int Quantity { get; set; } 
    }
}