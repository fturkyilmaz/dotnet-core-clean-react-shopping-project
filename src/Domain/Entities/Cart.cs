using System;

namespace ShoppingProject.Domain.Entities
{
    public class Cart
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public decimal Price { get; set; }
        public string Image { get; set; } = "";
        public int Quantity { get; set; }
    }
}