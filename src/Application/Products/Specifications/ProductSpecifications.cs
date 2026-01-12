using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Specifications;

public sealed class ActiveProductsSpecification
    : ActiveSpecification<Product>
{
    private ActiveProductsSpecification() { }

    public static ActiveProductsSpecification Create()
    {
        var spec = new ActiveProductsSpecification();
        spec.ApplyOrderBy(p => p.Title);
        return spec;
    }
}

public sealed class ProductsByCategorySpecification : BaseSpecification<Product>
{
    private ProductsByCategorySpecification(string category)
        : base(p => p.Category == category) { }

    public static ProductsByCategorySpecification Create(string category)
    {
        var spec = new ProductsByCategorySpecification(category);
        spec.ApplyOrderBy(p => p.Title);
        return spec;
    }
}

public sealed class ProductsWithPaginationSpecification : BaseSpecification<Product>
{
    private ProductsWithPaginationSpecification(int skip, int take) { }

    public static ProductsWithPaginationSpecification Create(int skip, int take)
    {
        var spec = new ProductsWithPaginationSpecification(skip, take);
        spec.ApplyPaging(skip, take);
        spec.ApplyOrderBy(p => p.Id);
        return spec;
    }
}

public sealed class ProductsByCategoryWithPaginationSpecification : BaseSpecification<Product>
{
    private ProductsByCategoryWithPaginationSpecification(string category)
        : base(p => p.Category == category) { }

    public static ProductsByCategoryWithPaginationSpecification Create(
        string category,
        int skip,
        int take
    )
    {
        var spec = new ProductsByCategoryWithPaginationSpecification(category);
        spec.ApplyPaging(skip, take);
        spec.ApplyOrderBy(p => p.Title);
        return spec;
    }
}

public sealed class SearchProductsSpecification : BaseSpecification<Product>
{
    private SearchProductsSpecification(string searchTerm)
        : base(p => p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm)) { }

    public static SearchProductsSpecification Create(string searchTerm)
    {
        var spec = new SearchProductsSpecification(searchTerm);
        spec.ApplyOrderBy(p => p.Title);
        return spec;
    }

    public static SearchProductsSpecification Create(string searchTerm, int skip, int take)
    {
        var spec = new SearchProductsSpecification(searchTerm);
        spec.ApplyPaging(skip, take);
        spec.ApplyOrderBy(p => p.Title);
        return spec;
    }
}

public sealed class ProductsByPriceRangeSpecification : BaseSpecification<Product>
{
    private ProductsByPriceRangeSpecification(decimal minPrice, decimal maxPrice)
        : base(p => p.Price >= minPrice && p.Price <= maxPrice) { }

    public static ProductsByPriceRangeSpecification Create(decimal minPrice, decimal maxPrice)
    {
        var spec = new ProductsByPriceRangeSpecification(minPrice, maxPrice);
        spec.ApplyOrderBy(p => p.Price);
        return spec;
    }
}
