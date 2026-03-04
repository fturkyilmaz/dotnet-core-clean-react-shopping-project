using ShoppingProject.Application.Common.Specifications;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Specifications;

public sealed class ActiveProductsSpecification
    : ActiveSpecification<Product>
{
    // Public constructor for test compatibility
    public ActiveProductsSpecification()
    {
        ApplyOrderBy(p => p.Id);
    }

    public static ActiveProductsSpecification Create()
    {
        return new ActiveProductsSpecification();
    }
}

public sealed class ProductsByCategorySpecification : BaseSpecification<Product>
{
    // Public constructor for test compatibility
    public ProductsByCategorySpecification(string category)
        : base(p => p.Category == category)
    {
        ApplyOrderBy(p => p.Title);
    }

    public static ProductsByCategorySpecification Create(string category)
    {
        return new ProductsByCategorySpecification(category);
    }
}

public sealed class ProductsWithPaginationSpecification : BaseSpecification<Product>
{
    // Public constructor for test compatibility (pageIndex is 1-based)
    public ProductsWithPaginationSpecification(int pageIndex, int pageSize)
        : base(_ => true)
    {
        ApplyPaging((pageIndex - 1) * pageSize, pageSize);
        ApplyOrderBy(p => p.Id);
    }

    // Static factory for skip/take pattern (backward compatibility)
    public static ProductsWithPaginationSpecification FromSkipTake(int skip, int take)
    {
        var pageIndex = (skip / take) + 1;
        return new ProductsWithPaginationSpecification(pageIndex, take);
    }

    public static ProductsWithPaginationSpecification Create(int skip, int take)
    {
        return FromSkipTake(skip, take);
    }

    /// <summary>
    /// Initializes the specification (for backward compatibility with tests).
    /// </summary>
    public void Initialize()
    {
        // No-op - constructor already initializes
    }
}

public sealed class ProductsByCategoryWithPaginationSpecification : BaseSpecification<Product>
{
    // Public constructor for test compatibility
    public ProductsByCategoryWithPaginationSpecification(string category, int pageIndex, int pageSize)
        : base(p => p.Category == category)
    {
        ApplyPaging((pageIndex - 1) * pageSize, pageSize);
        ApplyOrderBy(p => p.Title);
    }

    public static ProductsByCategoryWithPaginationSpecification Create(
        string category,
        int skip,
        int take
    )
    {
        var spec = new ProductsByCategoryWithPaginationSpecification(category, 1, take);
        spec.ApplyPaging(skip, take);
        return spec;
    }
}

public sealed class SearchProductsSpecification : BaseSpecification<Product>
{
    // Public constructor for test compatibility (string, int, int) - search with pagination
    public SearchProductsSpecification(string searchTerm, int skip, int take)
        : base(p => p.Title.Contains(searchTerm) || (p.Description != null && p.Description.Contains(searchTerm)))
    {
        ApplyPaging(skip, take);
        ApplyOrderBy(p => p.Title);
    }

    // Public constructor for test compatibility (string, bool, bool)
    public SearchProductsSpecification(string searchTerm, bool searchInDescription = false, bool caseSensitive = false)
        : base(_ => true)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            ApplyOrderBy(p => p.Title);
            return;
        }

        if (caseSensitive)
        {
            if (searchInDescription)
            {
                Criteria = p => p.Title.Contains(searchTerm) || (p.Description != null && p.Description.Contains(searchTerm));
            }
            else
            {
                Criteria = p => p.Title.Contains(searchTerm);
            }
        }
        else
        {
            var lowerSearchTerm = searchTerm.ToLower();
            if (searchInDescription)
            {
                Criteria = p => p.Title.ToLower().Contains(lowerSearchTerm) ||
                    (p.Description != null && p.Description.ToLower().Contains(lowerSearchTerm));
            }
            else
            {
                Criteria = p => p.Title.ToLower().Contains(lowerSearchTerm);
            }
        }

        ApplyOrderBy(p => p.Title);
    }

    public static SearchProductsSpecification Create(string searchTerm)
    {
        return new SearchProductsSpecification(searchTerm, false, false);
    }

    public static SearchProductsSpecification Create(string searchTerm, int skip, int take)
    {
        return new SearchProductsSpecification(searchTerm, skip, take);
    }
}

public sealed class ProductsByPriceRangeSpecification : BaseSpecification<Product>
{
    // Public constructor for test compatibility
    public ProductsByPriceRangeSpecification(decimal minPrice, decimal maxPrice)
        : base(p => p.Price >= minPrice && p.Price <= maxPrice)
    {
        ApplyOrderBy(p => p.Price);
    }

    public static ProductsByPriceRangeSpecification Create(decimal minPrice, decimal maxPrice)
    {
        return new ProductsByPriceRangeSpecification(minPrice, maxPrice);
    }
}
