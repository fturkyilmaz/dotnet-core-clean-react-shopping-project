using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.ValueObjects;

public sealed class ProductCategory : ValueObject
{
    public const int MaxLength = 50;
    public const int MinLength = 1;

    private static readonly HashSet<string> _validCategories = new(StringComparer.OrdinalIgnoreCase)
    {
        "electronics", "clothing", "books", "home", "sports", "beauty",
        "toys", "automotive", "health", "garden", "food", "beverages",
        "jewelry", "music", "movies", "games", "office", "pets"
    };

    private ProductCategory(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static Result<ProductCategory> Create(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return Result.Failure<ProductCategory>("Product category cannot be empty", ErrorType.Validation);

        var trimmedCategory = category.Trim().ToLower();

        if (trimmedCategory.Length < MinLength)
            return Result.Failure<ProductCategory>($"Product category must be at least {MinLength} characters", ErrorType.Validation);

        if (trimmedCategory.Length > MaxLength)
            return Result.Failure<ProductCategory>($"Product category cannot exceed {MaxLength} characters", ErrorType.Validation);

        // Allow custom categories but validate common ones
        if (_validCategories.Contains(trimmedCategory))
        {
            return Result.Success(new ProductCategory(trimmedCategory));
        }

        // For custom categories, ensure they are valid identifiers
        if (!IsValidCategoryName(trimmedCategory))
            return Result.Failure<ProductCategory>("Invalid category name format", ErrorType.Validation);

        return Result.Success(new ProductCategory(trimmedCategory));
    }

    private static bool IsValidCategoryName(string category)
    {
        // Only allow letters, numbers, and spaces
        return category.All(c => char.IsLetterOrDigit(c) || c == ' ');
    }

    public static IEnumerable<string> GetValidCategories() => _validCategories;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
