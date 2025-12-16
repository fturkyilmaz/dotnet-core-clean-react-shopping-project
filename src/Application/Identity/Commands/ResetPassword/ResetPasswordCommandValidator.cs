using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.ResetPassword;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty()
            .WithMessage("Email boş olamaz.")
            .EmailAddress()
            .WithMessage("Geçerli bir email adresi girin.");

        RuleFor(v => v.Token).NotEmpty().WithMessage("Token boş olamaz.");

        RuleFor(v => v.NewPassword)
            .NotEmpty()
            .WithMessage("Yeni şifre boş olamaz.")
            .MinimumLength(6)
            .WithMessage("Yeni şifre en az 6 karakter olmalıdır.");
    }
}
