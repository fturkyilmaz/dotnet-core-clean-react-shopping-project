namespace ShoppingProject.Application.Products.Commands.CreateProduct;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(v => v.Title)
            .NotEmpty()
            .WithMessage("Product title is required.")
            .MaximumLength(200)
            .WithMessage("Product title must not exceed 200 characters.");

        RuleFor(v => v.Price).GreaterThan(0).WithMessage("Price must be greater than zero.");

        RuleFor(v => v.Description)
            .NotEmpty()
            .WithMessage("Description is required.")
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters.");

        RuleFor(v => v.Image)
            .NotEmpty()
            .WithMessage("Image URL is required.")
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("Image must be a valid URL.");

        RuleFor(v => v.Category).NotEmpty().WithMessage("Category is required.");
    }
}
