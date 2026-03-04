using FluentValidation;
using ShoppingProject.Application.Carts.Commands.CreateCart;
using ShoppingProject.Application.Carts.Commands.UpdateCart;

namespace ShoppingProject.Application.Validators;

/// <summary>
/// Validator for CreateCartCommand.
/// </summary>
public class CreateCartCommandValidator : AbstractValidator<CreateCartCommand>
{
    public CreateCartCommandValidator()
    {
        RuleFor(x => x.OwnerId)
            .NotEmptyWithMessage("OwnerId");

        RuleFor(x => x.Title)
            .NotEmptyWithMessage("Title")
            .LengthWithMessage(1, 200);

        RuleFor(x => x.Price)
            .GreaterThanZero()
            .InRange(0.01m, 1000000m);

        RuleFor(x => x.Quantity)
            .GreaterThanZero()
            .InRange(1, 1000);

        RuleFor(x => x.Image)
            .ValidUrl()
            .When(x => !string.IsNullOrEmpty(x.Image));
    }
}

/// <summary>
/// Validator for UpdateCartCommand.
/// </summary>
public class UpdateCartCommandValidator : AbstractValidator<UpdateCartCommand>
{
    public UpdateCartCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThanZero();

        RuleFor(x => x.Title)
            .NotEmptyWithMessage("Title")
            .LengthWithMessage(1, 200);

        RuleFor(x => x.Price)
            .GreaterThanZero()
            .InRange(0.01m, 1000000m);

        RuleFor(x => x.Quantity)
            .GreaterThanZero()
            .InRange(1, 1000);

        RuleFor(x => x.Image)
            .ValidUrl()
            .When(x => !string.IsNullOrEmpty(x.Image));
    }
}
