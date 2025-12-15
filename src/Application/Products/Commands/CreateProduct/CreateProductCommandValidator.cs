namespace ShoppingProject.Application.Products.Commands.CreateProduct;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(200).NotEmpty();
        RuleFor(v => v.Price).NotEmpty();
        RuleFor(v => v.Description).NotEmpty();
        RuleFor(v => v.Image).NotEmpty();
        RuleFor(v => v.Category).NotEmpty();
    }
}
