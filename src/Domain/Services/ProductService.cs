using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.ValueObjects;
using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Services;

public class ProductService : IProductService
{
    public Result<Product> CreateProduct(
        ProductTitle title,
        Money price,
        ProductDescription description,
        ProductCategory category,
        ProductImage image)
    {
        return Product.Create(title, price, description, category, image);
    }

    public Result UpdateProductPrice(Product product, Money newPrice)
    {
        return product.UpdatePrice(newPrice);
    }

    public Result UpdateProductDetails(
        Product product,
        ProductTitle? title = null,
        ProductDescription? description = null,
        ProductCategory? category = null,
        ProductImage? image = null)
    {
        return product.UpdateDetails(title, description, category, image);
    }

    public void AddProductRating(Product product, double rating)
    {
        product.AddRating(rating);
    }

    public bool IsProductAvailable(Product product)
    {
        return product.IsAvailable;
    }

    public IEnumerable<Product> GetProductsByCategory(ProductCategory category)
    {
        // Bu method domain logic için. Persistence layer'da implement edilecek
        // Şimdilik boş collection döndürüyoruz
        return Enumerable.Empty<Product>();
    }

    public IEnumerable<Product> SearchProducts(string searchTerm)
    {
        // Bu method domain logic için. Persistence layer'da implement edilecek
        // Şimdilik boş collection döndürüyoruz
        return Enumerable.Empty<Product>();
    }

    // Business Rules
    public bool CanUpdateProduct(Product product)
    {
        // Business rule: Product can be updated if it has no pending orders
        // Bu logic persistence layer'da kontrol edilecek
        return true;
    }

    public bool IsValidProductCategory(ProductCategory category)
    {
        // Business rule: Category must be from predefined list or valid custom category
        return !string.IsNullOrEmpty(category.Value);
    }
}
