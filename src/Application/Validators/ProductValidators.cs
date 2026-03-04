using FluentValidation;
using ShoppingProject.Application.Products.Commands.CreateProduct;
using ShoppingProject.Application.Products.Commands.UpdateProduct;

namespace ShoppingProject.Application.Validators;

/// <summary>
/// Validator for CreateProductCommand.
/// </summary>
public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmptyWithMessage("Title")
            .LengthWithMessage(2, 200);

        RuleFor(x => x.Description)
            .MaximumLengthWithMessage(4000);

        RuleFor(x => x.Price)
            .GreaterThanZero()
            .InRange(0.01m, 1000000m);

        RuleFor(x => x.Category)
            .NotEmptyWithMessage("Category")
            .MaximumLengthWithMessage(100);

        RuleFor(x => x.Image)
            .ValidUrl()
            .When(x => !string.IsNullOrEmpty(x.Image));
    }
}

/// <summary>
/// Validator for UpdateProductCommand.
/// </summary>
public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThanZero();

        RuleFor(x => x.Title)
            .NotEmptyWithMessage("Title")
            .LengthWithMessage(2, 200);

        RuleFor(x => x.Description)
            .MaximumLengthWithMessage(4000);

        RuleFor(x => x.Price)
            .GreaterThanZero()
            .InRange(0.01m, 1000000m);

        RuleFor(x => x.Category)
            .NotEmptyWithMessage("Category")
            .MaximumLengthWithMessage(100);

        RuleFor(x => x.Image)
            .ValidUrl()
            .When(x => !string.IsNullOrEmpty(x.Image));
    }
}
