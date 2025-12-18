using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Specifications;

public class ActiveProductsSpecification : BaseSpecification<Product>
{
    public ActiveProductsSpecification()
        : base(p => p.Price > 0) // Example: active products have price > 0
    {
    }

    public void Initialize()
    {
        ApplyOrderBy(p => p.Title);
    }
}

public class ProductsByCategorySpecification : BaseSpecification<Product>
{
    public ProductsByCategorySpecification(string category)
        : base(p => p.Category == category)
    {
    }

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
