using FluentValidation;

namespace ShoppingProject.Application.Carts.Commands.CreateCart;

public class CreateCartCommandValidator : AbstractValidator<CreateCartCommand>
{
    public CreateCartCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(200).NotEmpty();

        RuleFor(v => v.Price).GreaterThan(0);

        RuleFor(v => v.Quantity).GreaterThan(0);
    }
}
