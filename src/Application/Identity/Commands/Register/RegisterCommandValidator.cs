using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty()
            .WithMessage("Email boş olamaz.")
            .EmailAddress()
            .WithMessage("Geçerli bir email adresi girin.");

        RuleFor(v => v.Password)
            .NotEmpty()
            .WithMessage("Şifre boş olamaz.")
            .MinimumLength(6)
            .WithMessage("Şifre en az 6 karakter olmalıdır.");

        RuleFor(v => v.FirstName).NotEmpty().WithMessage("Ad alanı boş olamaz.");

        RuleFor(v => v.LastName).NotEmpty().WithMessage("Soyad alanı boş olamaz.");
    }
}
