namespace ShoppingProject.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(v => v.Title)
            .MaximumLength(200)
            .NotEmpty();
        RuleFor(v => v.Price)
            .NotEmpty();
        RuleFor(v => v.Description)
            .NotEmpty();    
        RuleFor(v => v.Image)
            .NotEmpty();    
        RuleFor(v => v.Category)
            .NotEmpty();           
    }
}
