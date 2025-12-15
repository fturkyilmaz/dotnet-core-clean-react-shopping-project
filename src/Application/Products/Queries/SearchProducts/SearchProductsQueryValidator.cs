using FluentValidation;

namespace ShoppingProject.Application.Products.Queries.SearchProducts;

public class SearchProductsQueryValidator : AbstractValidator<SearchProductsQuery>
{
    public SearchProductsQueryValidator()
    {
        RuleFor(x => x.Index)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Page index must be 0 or greater.");

        RuleFor(x => x.Size)
            .GreaterThan(0)
            .WithMessage("Page size must be greater than 0.")
            .LessThanOrEqualTo(100)
            .WithMessage("Page size must not exceed 100.");
    }
}
