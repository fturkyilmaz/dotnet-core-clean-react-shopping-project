using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.ValueObjects;

namespace ShoppingProject.Domain.Services;

public interface IProductService
{
    Result<Product> CreateProduct(
        ProductTitle title,
        Money price,
        ProductDescription description,
        ProductCategory category,
        ProductImage image);

    Result UpdateProductPrice(Product product, Money newPrice);

    Result UpdateProductDetails(
        Product product,
        ProductTitle? title = null,
        ProductDescription? description = null,
        ProductCategory? category = null,
        ProductImage? image = null);

    void AddProductRating(Product product, double rating);

    bool IsProductAvailable(Product product);

    IEnumerable<Product> GetProductsByCategory(ProductCategory category);

    IEnumerable<Product> SearchProducts(string searchTerm);
}
