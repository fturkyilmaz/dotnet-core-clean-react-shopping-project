using CleanArchitecture.Application.DTOs;

namespace CleanArchitecture.Application.DTOs
{
    public class UpdateProductDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
    }
}
