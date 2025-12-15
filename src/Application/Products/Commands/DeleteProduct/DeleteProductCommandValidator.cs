using FluentValidation;

namespace ShoppingProject.Application.Products.Commands.DeleteProduct;

public class DeleteProductCommandValidator : AbstractValidator<DeleteProductCommand>
{
    public DeleteProductCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Product Id must be greater than 0.");
    }
}
