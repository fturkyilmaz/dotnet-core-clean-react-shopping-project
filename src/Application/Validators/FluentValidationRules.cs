using System.Text.RegularExpressions;
using FluentValidation;

namespace ShoppingProject.Application.Validators;

/// <summary>
/// Reusable validation rules for common scenarios.
/// </summary>
public static class FluentValidationRules
{
    #region String Validations

    /// <summary>
    /// Validates that a string is not null or empty.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> NotEmptyWithMessage<T>(
        this IRuleBuilder<T, string?> rule, string fieldName)
    {
        return rule
            .NotEmpty()
            .WithMessage($"{{PropertyName}} is required. [Code: E1001]")
            .WithErrorCode("E1001");
    }

    /// <summary>
    /// Validates string length with min and max constraints.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> LengthWithMessage<T>(
        this IRuleBuilder<T, string?> rule, int min, int max)
    {
        return rule
            .Length(min, max)
            .WithMessage($"{{PropertyName}} must be between {min} and {max} characters. [Code: E1002]")
            .WithErrorCode("E1002");
    }

    /// <summary>
    /// Validates maximum string length.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> MaximumLengthWithMessage<T>(
        this IRuleBuilder<T, string?> rule, int maxLength)
    {
        return rule
            .MaximumLength(maxLength)
            .WithMessage($"{{PropertyName}} must not exceed {maxLength} characters. [Code: E1003]")
            .WithErrorCode("E1003");
    }

    /// <summary>
    /// Validates that a string matches a specific pattern.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> MatchesPatternWithMessage<T>(
        this IRuleBuilder<T, string?> rule, string pattern, string patternName)
    {
        return rule
            .Matches(pattern)
            .WithMessage($"{{PropertyName}} must be a valid {patternName}. [Code: E1004]")
            .WithErrorCode("E1004");
    }

    /// <summary>
    /// Validates email format.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidEmailWithMessage<T>(
        this IRuleBuilder<T, string?> rule)
    {
        return rule
            .EmailAddress()
            .WithMessage("Invalid email format. [Code: E1005]")
            .WithErrorCode("E1005");
    }

    #endregion

    #region Numeric Validations

    /// <summary>
    /// Validates that a number is greater than zero.
    /// </summary>
    public static IRuleBuilderOptions<T, int> GreaterThanZero<T>(
        this IRuleBuilder<T, int> rule)
    {
        return rule
            .GreaterThan(0)
            .WithMessage("{PropertyName} must be greater than 0. [Code: E1010]")
            .WithErrorCode("E1010");
    }

    /// <summary>
    /// Validates that a number is greater than zero.
    /// </summary>
    public static IRuleBuilderOptions<T, decimal> GreaterThanZero<T>(
        this IRuleBuilder<T, decimal> rule)
    {
        return rule
            .GreaterThan(0)
            .WithMessage("{PropertyName} must be greater than 0. [Code: E1010]")
            .WithErrorCode("E1010");
    }

    /// <summary>
    /// Validates that a number is within a range.
    /// </summary>
    public static IRuleBuilderOptions<T, int> InRange<T>(
        this IRuleBuilder<T, int> rule, int min, int max)
    {
        return rule
            .InclusiveBetween(min, max)
            .WithMessage($"{{PropertyName}} must be between {min} and {max}. [Code: E1011]")
            .WithErrorCode("E1011");
    }

    /// <summary>
    /// Validates that a decimal is within a range.
    /// </summary>
    public static IRuleBuilderOptions<T, decimal> InRange<T>(
        this IRuleBuilder<T, decimal> rule, decimal min, decimal max)
    {
        return rule
            .InclusiveBetween(min, max)
            .WithMessage($"{{PropertyName}} must be between {min} and {max}. [Code: E1011]")
            .WithErrorCode("E1011");
    }

    #endregion

    #region Collection Validations

    /// <summary>
    /// Validates that a collection is not empty.
    /// </summary>
    public static IRuleBuilderOptions<T, IEnumerable<TItem>> NotEmptyCollection<T, TItem>(
        this IRuleBuilder<T, IEnumerable<TItem>> rule)
    {
        return rule
            .NotEmpty()
            .WithMessage("{PropertyName} must contain at least one item. [Code: E1020]")
            .WithErrorCode("E1020");
    }

    /// <summary>
    /// Validates collection size.
    /// </summary>
    public static IRuleBuilderOptions<T, IEnumerable<TItem>> CollectionSize<T, TItem>(
        this IRuleBuilder<T, IEnumerable<TItem>> rule, int maxSize)
    {
        return rule
            .Must(x => x.Count() <= maxSize)
            .WithMessage($"{{PropertyName}} must not exceed {maxSize} items. [Code: E1021]")
            .WithErrorCode("E1021");
    }

    #endregion

    #region DateTime Validations

    /// <summary>
    /// Validates that a date is not in the past.
    /// </summary>
    public static IRuleBuilderOptions<T, DateTime> NotInPast<T>(
        this IRuleBuilder<T, DateTime> rule)
    {
        return rule
            .Must(date => date >= DateTime.UtcNow.Date)
            .WithMessage("{PropertyName} cannot be in the past. [Code: E1030]")
            .WithErrorCode("E1030");
    }

    /// <summary>
    /// Validates that a date is not in the future.
    /// </summary>
    public static IRuleBuilderOptions<T, DateTime> NotInFuture<T>(
        this IRuleBuilder<T, DateTime> rule)
    {
        return rule
            .Must(date => date <= DateTime.UtcNow)
            .WithMessage("{PropertyName} cannot be in the future. [Code: E1031]")
            .WithErrorCode("E1031");
    }

    /// <summary>
    /// Validates date range.
    /// </summary>
    public static IRuleBuilderOptions<T, DateTime> WithinRange<T>(
        this IRuleBuilder<T, DateTime> rule, DateTime minDate, DateTime maxDate)
    {
        return rule
            .InclusiveBetween(minDate, maxDate)
            .WithMessage($"{{PropertyName}} must be between {{From}} and {{To}}. [Code: E1032]")
            .WithErrorCode("E1032");
    }

    #endregion

    #region Special Validations

    /// <summary>
    /// Validates URL format.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidUrl<T>(
        this IRuleBuilder<T, string?> rule)
    {
        return rule
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
                        (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .WithMessage("Invalid URL format. [Code: E1040]")
            .WithErrorCode("E1040");
    }

    /// <summary>
    /// Validates Guid format.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidGuid<T>(
        this IRuleBuilder<T, string?> rule)
    {
        return rule
            .Must(id => Guid.TryParse(id, out _))
            .WithMessage("Invalid GUID format. [Code: E1041]")
            .WithErrorCode("E1041");
    }

    /// <summary>
    /// Validates phone number format (international).
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidPhoneNumber<T>(
        this IRuleBuilder<T, string?> rule)
    {
        const string pattern = @"^\+?[1-9]\d{1,14}$";
        return rule
            .Matches(pattern)
            .WithMessage("Invalid phone number format. [Code: E1042]")
            .WithErrorCode("E1042");
    }

    /// <summary>
    /// Validates postal code format.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidPostalCode<T>(
        this IRuleBuilder<T, string?> rule)
    {
        return rule
            .Must(code => !string.IsNullOrEmpty(code) && code.Length >= 3 && code.Length <= 10)
            .WithMessage("Invalid postal code format. [Code: E1043]")
            .WithErrorCode("E1043");
    }

    #endregion
}
