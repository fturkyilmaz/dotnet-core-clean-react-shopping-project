using FluentValidation;

namespace ShoppingProject.Application.Identity.Commands.AssignAdminRole;

public class AssignAdminRoleCommandValidator : AbstractValidator<AssignAdminRoleCommand>
{
    public AssignAdminRoleCommandValidator()
    {
        RuleFor(v => v.UserId).NotEmpty().WithMessage("Kullanıcı ID'si boş olamaz.");
    }
}
