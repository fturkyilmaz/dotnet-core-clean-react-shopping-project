using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Specifications;

public class ActiveProductsSpecification : BaseSpecification<Product>
{
    public ActiveProductsSpecification()
        : base(p => p.Price > 0) { }

    public void Initialize()
    {
        ApplyOrderBy(p => p.Title);
    }
}

public class ProductsByCategorySpecification : BaseSpecification<Product>
{
    public ProductsByCategorySpecification(string category)
        : base(p => p.Category == category) { }

    public void Initialize()
    {
        ApplyOrderBy(p => p.Title);
    }
}

public class ProductsWithPaginationSpecification : BaseSpecification<Product>
{
    private readonly int _skip;
    private readonly int _take;

    public ProductsWithPaginationSpecification(int skip, int take)
    {
        _skip = skip;
        _take = take;
    }

    public void Initialize()
    {
        ApplyPaging(_skip, _take);
        ApplyOrderBy(p => p.Id);
    }
}

public class ProductsByCategoryWithPaginationSpecification : BaseSpecification<Product>
{
    public ProductsByCategoryWithPaginationSpecification(string category, int skip, int take)
        : base(p => p.Category == category)
    {
        ApplyPaging(skip, take);
        ApplyOrderBy(p => p.Title);
    }
}

public class SearchProductsSpecification : BaseSpecification<Product>
{
    public SearchProductsSpecification(string searchTerm)
        : base(p => p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm))
    {
        ApplyOrderBy(p => p.Title);
    }

    public SearchProductsSpecification(string searchTerm, int skip, int take)
        : base(p => p.Title.Contains(searchTerm) || p.Description.Contains(searchTerm))
    {
        ApplyPaging(skip, take);
        ApplyOrderBy(p => p.Title);
    }
}

public class ProductsByPriceRangeSpecification : BaseSpecification<Product>
{
    public ProductsByPriceRangeSpecification(decimal minPrice, decimal maxPrice)
        : base(p => p.Price >= minPrice && p.Price <= maxPrice)
    {
        ApplyOrderBy(p => p.Price);
    }
}
