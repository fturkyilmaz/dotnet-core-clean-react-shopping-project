namespace ShoppingProject.Application.Identity.Commands.UpdateMe;
public class UpdateMeCommandValidator : AbstractValidator<UpdateMeCommand>
{
    public UpdateMeCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.");

        RuleFor(x => x.FirstName)
            .MaximumLength(50)
            .When(x => x.FirstName is not null)
            .WithMessage("First name cannot exceed 50 characters.");

        RuleFor(x => x.LastName)
            .MaximumLength(50)
            .When(x => x.LastName is not null)
            .WithMessage("Last name cannot exceed 50 characters.");

        RuleFor(x => x.Gender)
            .Must(BeValidGender)
            .When(x => x.Gender is not null)
            .WithMessage("Gender must be one of: Male, Female, Other.");
    }
    private static bool BeValidGender(string gender)
    {
        return gender is "Male" or "Female" or "Other" or "Unknown";
    }
}
