using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.DTOs
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
    }
}
