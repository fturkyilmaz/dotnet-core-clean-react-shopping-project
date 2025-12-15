using FluentValidation;

namespace ShoppingProject.Application.Carts.Commands.DeleteCart;

public class DeleteCartCommandValidator : AbstractValidator<DeleteCartCommand>
{
    public DeleteCartCommandValidator()
    {
        RuleFor(v => v.Id)
            .GreaterThan(0)
            .WithMessage("Cart Id must be greater than 0.")
            .NotEmpty()
            .WithMessage("Cart Id is required.");
    }
}
