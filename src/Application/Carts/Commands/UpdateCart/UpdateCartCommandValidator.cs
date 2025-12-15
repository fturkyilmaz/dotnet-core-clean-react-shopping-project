using FluentValidation;

namespace ShoppingProject.Application.Carts.Commands.UpdateCart;

public class UpdateCartCommandValidator : AbstractValidator<UpdateCartCommand>
{
    public UpdateCartCommandValidator()
    {
        RuleFor(v => v.Id)
            .GreaterThan(0)
            .WithMessage("Cart Id must be greater than 0.")
            .NotEmpty()
            .WithMessage("Cart Id is required.");

        RuleFor(v => v.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(200)
            .WithMessage("Title must not exceed 200 characters.");

        RuleFor(v => v.Price).GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(v => v.Quantity)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Quantity must be at least 1.");
    }
}
