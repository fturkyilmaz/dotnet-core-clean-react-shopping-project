using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.ValueObjects;

public sealed class ProductDescription : ValueObject
{
    public const int MaxLength = 1000;
    public const int MinLength = 10;

    private ProductDescription(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Result<ProductDescription> Create(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            return Result.Failure<ProductDescription>("Product description cannot be empty", ErrorType.Validation);

        var trimmedDescription = description.Trim();

        if (trimmedDescription.Length < MinLength)
            return Result.Failure<ProductDescription>($"Product description must be at least {MinLength} characters", ErrorType.Validation);

        if (trimmedDescription.Length > MaxLength)
            return Result.Failure<ProductDescription>($"Product description cannot exceed {MaxLength} characters", ErrorType.Validation);

        return Result.Success(new ProductDescription(trimmedDescription));
    }

    public static Result<ProductDescription> CreateOptional(string? description)
    {
        if (string.IsNullOrWhiteSpace(description))
            return Result.Success(new ProductDescription(string.Empty));

        return Create(description!);
    }

    public bool IsEmpty => string.IsNullOrEmpty(Value);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
