using FluentValidation;

namespace ShoppingProject.Application.Products.Queries.GetProducts;

public class GetAllProductsQueryValidator : AbstractValidator<GetProductsQuery>
{
    public GetAllProductsQueryValidator() { }
}
