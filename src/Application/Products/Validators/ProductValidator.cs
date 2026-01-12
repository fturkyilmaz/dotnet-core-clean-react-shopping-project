using FluentValidation;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Validators;

/// <summary>
/// Validator for Product entity.
/// Ensures all product properties meet business requirements.
/// </summary>
public class ProductValidator : AbstractValidator<Product>
{
    public ProductValidator()
    {
        RuleFor(p => p.Title)
            .NotEmpty().WithMessage("Product title is required")
            .Length(3, 200).WithMessage("Product title must be between 3 and 200 characters");

        RuleFor(p => p.Price)
            .GreaterThan(0).WithMessage("Product price must be greater than zero")
            .LessThanOrEqualTo(decimal.MaxValue).WithMessage("Product price is too large");

        RuleFor(p => p.Description)
            .Length(0, 2000).WithMessage("Product description cannot exceed 2000 characters");

        RuleFor(p => p.Category)
            .NotEmpty().WithMessage("Product category is required")
            .Length(2, 100).WithMessage("Product category must be between 2 and 100 characters");

        RuleFor(p => p.Image)
            .Must(BeValidUrl).When(p => !string.IsNullOrEmpty(p.Image))
            .WithMessage("Product image must be a valid URL");

        RuleFor(p => p.Rating)
            .NotNull().WithMessage("Product rating is required");
    }

    private static bool BeValidUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
