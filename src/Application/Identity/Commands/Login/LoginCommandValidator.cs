using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty()
            .WithMessage("E-posta alanı boş bırakılamaz.")
            .MaximumLength(200)
            .WithMessage("E-posta 200 karakterden uzun olamaz.")
            .EmailAddress()
            .WithMessage("Geçerli bir e-posta adresi giriniz.");

        RuleFor(v => v.Password)
            .NotEmpty()
            .WithMessage("Şifre alanı boş bırakılamaz.")
            .MinimumLength(8)
            .WithMessage("Şifre en az 8 karakter uzunluğunda olmalıdır.");
    }
}
