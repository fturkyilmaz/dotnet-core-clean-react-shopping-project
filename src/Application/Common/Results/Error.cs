namespace ShoppingProject.Application.Common.Results;

/// <summary>
/// Represents an error that occurred during an operation.
/// </summary>
public sealed record Error(string Code, string Message)
{
    /// <summary>
    /// Creates an error for a specific property validation failure.
    /// </summary>
    public static Error ValidationFailure(string propertyName, string message) =>
        new($"Validation.{propertyName}", message);

    /// <summary>
    /// Creates a not found error.
    /// </summary>
    public static Error NotFound(string resourceName, string identifier) =>
        new("NotFound", $"{resourceName} with identifier '{identifier}' was not found.");

    /// <summary>
    /// Creates a conflict error (e.g., duplicate key, version conflict).
    /// </summary>
    public static Error Conflict(string message) => new("Conflict", message);

    /// <summary>
    /// Creates a forbidden error (authorization failure).
    /// </summary>
    public static Error Forbidden(
        string message = "You do not have permission to perform this action."
    ) => new("Forbidden", message);

    /// <summary>
    /// Creates an unauthorized error (authentication failure).
    /// </summary>
    public static Error Unauthorized(
        string message = "You must be authenticated to access this resource."
    ) => new("Unauthorized", message);

    /// <summary>
    /// Creates a general business logic error.
    /// </summary>
    public static Error BusinessLogic(string message) => new("BusinessLogic", message);

    /// <summary>
    /// Creates an internal server error.
    /// </summary>
    public static Error InternalServerError(
        string message = "An unexpected error occurred. Please try again later."
    ) => new("InternalServerError", message);
}
