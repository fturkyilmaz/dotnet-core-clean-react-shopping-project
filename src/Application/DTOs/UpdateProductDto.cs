using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.DTOs
{
    public class UpdateProductDto
    {
        public string Title { get; set; } = "";
        public decimal Price { get; set; }
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";
        public string Image { get; set; } = "";
        public RatingDto? Rating { get; set; }
    }
}
