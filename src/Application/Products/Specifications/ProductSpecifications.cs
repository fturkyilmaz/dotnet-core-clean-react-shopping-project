using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Specifications;

public class ActiveProductsSpecification : BaseSpecification<Product>
{
    public ActiveProductsSpecification()
        : base(p => p.Price > 0) // Example: active products have price > 0
    {
        ApplyOrderBy(p => p.Title);
    }
}

public class ProductsByCategorySpecification : BaseSpecification<Product>
{
    public ProductsByCategorySpecification(string category)
        : base(p => p.Category == category)
    {
        ApplyOrderBy(p => p.Title);
    }
}

public class ProductsWithPaginationSpecification : BaseSpecification<Product>
{
    public ProductsWithPaginationSpecification(int skip, int take)
    {
        ApplyPaging(skip, take);
        ApplyOrderBy(p => p.Id);
    }
}
