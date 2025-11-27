using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.ValueObjects;

public sealed class ProductImage : ValueObject
{
    private static readonly string[] _allowedExtensions =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
    };
    public const int MaxUrlLength = 500;

    private ProductImage(string url)
    {
        Url = url;
    }

    public string Url { get; }

    public static Result<ProductImage> Create(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return Result.Failure<ProductImage>(
                "Product image URL cannot be empty",
                ErrorType.Validation
            );

        var trimmedUrl = url.Trim();

        if (trimmedUrl.Length > MaxUrlLength)
            return Result.Failure<ProductImage>(
                $"Image URL cannot exceed {MaxUrlLength} characters",
                ErrorType.Validation
            );

        if (!IsValidUrl(trimmedUrl))
            return Result.Failure<ProductImage>("Invalid image URL format", ErrorType.Validation);

        if (!HasValidImageExtension(trimmedUrl))
            return Result.Failure<ProductImage>(
                $"Image must be one of: {string.Join(", ", _allowedExtensions)}",
                ErrorType.Validation
            );

        return Result.Success(new ProductImage(trimmedUrl));
    }

    public static Result<ProductImage> CreateOptional(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return Result.Success(new ProductImage(string.Empty));

        return Create(url!);
    }

    private static bool IsValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private static bool HasValidImageExtension(string url)
    {
        var extension = Path.GetExtension(url).ToLower();
        return _allowedExtensions.Contains(extension);
    }

    public bool IsEmpty => string.IsNullOrEmpty(Url);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Url;
    }

    public override string ToString() => Url;
}
