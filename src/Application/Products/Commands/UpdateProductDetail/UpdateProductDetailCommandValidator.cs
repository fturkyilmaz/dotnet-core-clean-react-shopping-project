using FluentValidation;

namespace ShoppingProject.Application.Products.Commands.UpdateProductDetail;

public class UpdateProductDetailCommandValidator : AbstractValidator<UpdateProductDetailCommand>
{
    public UpdateProductDetailCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Product Id must be greater than 0.");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(200)
            .WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Price).GreaterThan(0).WithMessage("Price must be greater than zero.");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description must not exceed 1000 characters.");

        RuleFor(x => x.Category)
            .MaximumLength(100)
            .WithMessage("Category must not exceed 100 characters.");
    }
}
