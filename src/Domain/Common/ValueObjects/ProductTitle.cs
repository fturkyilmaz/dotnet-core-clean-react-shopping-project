using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.ValueObjects;

public sealed class ProductTitle : ValueObject
{
    public const int MaxLength = 100;
    public const int MinLength = 1;

    private ProductTitle(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Result<ProductTitle> Create(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Result.Failure<ProductTitle>("Product title cannot be empty", ErrorType.Validation);

        var trimmedTitle = title.Trim();

        if (trimmedTitle.Length < MinLength)
            return Result.Failure<ProductTitle>($"Product title must be at least {MinLength} characters", ErrorType.Validation);

        if (trimmedTitle.Length > MaxLength)
            return Result.Failure<ProductTitle>($"Product title cannot exceed {MaxLength} characters", ErrorType.Validation);

        return Result.Success(new ProductTitle(trimmedTitle));
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
