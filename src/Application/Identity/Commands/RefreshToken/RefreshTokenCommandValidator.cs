using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.RefreshToken;

public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(v => v.AccessToken).NotEmpty().WithMessage("AccessToken boş olamaz.");

        RuleFor(v => v.RefreshToken).NotEmpty().WithMessage("RefreshToken boş olamaz.");
    }
}
