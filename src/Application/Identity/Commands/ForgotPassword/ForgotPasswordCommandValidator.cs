using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.ForgotPassword;

public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty()
            .WithMessage("Email boş olamaz.")
            .EmailAddress()
            .WithMessage("Geçerli bir email adresi girin.");
    }
}
