namespace ShoppingProject.Application.DTOs
{
    public class UpdateCartDto
    {
        public string Title { get; set; } = "";
        public decimal Price { get; set; }
        public string Image { get; set; } = "";
        public int Quantity { get; set; }
    }
}
