using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Queries.GetProductWithPagination;

public class ProductBriefDto
{
    public int Id { get; init; }

    public string? Title { get; init; }

    public decimal Price { get; init; }

    public string? Category { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Product, ProductBriefDto>();
        }
    }
}
