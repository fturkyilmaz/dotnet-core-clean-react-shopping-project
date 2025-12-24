using FluentValidation;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Carts.Validators;

/// <summary>
/// Validator for Cart entity.
/// Ensures all cart properties meet business requirements.
/// </summary>
public class CartValidator : AbstractValidator<Cart>
{
    public CartValidator()
    {
        RuleFor(c => c.OwnerId)
            .NotEmpty().WithMessage("Cart owner ID is required");
    }
}
