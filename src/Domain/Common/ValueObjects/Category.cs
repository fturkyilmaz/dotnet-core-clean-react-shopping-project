namespace ShoppingProject.Domain.Common.ValueObjects;

public sealed class Category : ValueObject
{
    public string Value { get; }

    private Category(string value)
    {
        Value = value;
    }

    public static Category Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Category is invalid");

        return new Category(value.Trim().ToLowerInvariant());
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}
