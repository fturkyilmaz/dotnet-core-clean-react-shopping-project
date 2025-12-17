namespace ShoppingProject.Domain.Entities
{
    public class Cart : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public string OwnerId { get; set; } = string.Empty;
    }
}
