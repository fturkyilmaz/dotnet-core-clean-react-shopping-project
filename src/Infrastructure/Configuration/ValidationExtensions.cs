using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ShoppingProject.Infrastructure.Configuration;

public static class OptionsBuilderFluentValidationExtensions
{
    /// <summary>
    /// Enables FluentValidation for options binding.
    /// </summary>
    public static OptionsBuilder<TOptions> ValidateFluently<TOptions>(
        this OptionsBuilder<TOptions> optionsBuilder
    )
        where TOptions : class
    {
        optionsBuilder.Services.AddSingleton<IValidateOptions<TOptions>>(sp =>
        {
            var validator = sp.GetRequiredService<IValidator<TOptions>>();
            return new FluentValidationOptions<TOptions>(validator);
        });

        return optionsBuilder;
    }
}

/// <summary>
/// Wraps FluentValidation validator into IValidateOptions.
/// </summary>
public class FluentValidationOptions<TOptions> : IValidateOptions<TOptions>
    where TOptions : class
{
    private readonly IValidator<TOptions> _validator;

    public FluentValidationOptions(IValidator<TOptions> validator)
    {
        _validator = validator;
    }

    public ValidateOptionsResult Validate(string? name, TOptions options)
    {
        var result = _validator.Validate(options);
        if (result.IsValid)
            return ValidateOptionsResult.Success;

        var errors = string.Join("; ", result.Errors.Select(e => e.ErrorMessage));
        return ValidateOptionsResult.Fail(errors);
    }
}
