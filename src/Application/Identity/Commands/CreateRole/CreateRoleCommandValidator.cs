using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.CreateRole;

public class CreateRoleCommandValidator : AbstractValidator<CreateRoleCommand>
{
    public CreateRoleCommandValidator()
    {
        RuleFor(v => v.RoleName)
            .NotEmpty()
            .WithMessage("Rol adı boş olamaz.")
            .MinimumLength(3)
            .WithMessage("Rol adı en az 3 karakter olmalıdır.");
    }
}
