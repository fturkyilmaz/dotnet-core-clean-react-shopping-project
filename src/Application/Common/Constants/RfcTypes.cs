namespace ShoppingProject.Application.Common.Constants;

/// <summary>
/// RFC 7231/4918/7235 specification links for standardized ProblemDetails responses.
/// </summary>
public static class RfcTypes
{
    public const string InternalServerError = "https://tools.ietf.org/html/rfc7231#section-6.6.1";
    public const string NotFound = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
    public const string Forbidden = "https://tools.ietf.org/html/rfc7231#section-6.5.3";
    public const string BadRequest = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
    public const string Validation = "https://tools.ietf.org/html/rfc4918#section-11.2";
    public const string Unauthorized = "https://tools.ietf.org/html/rfc7235#section-3.1";
}
