namespace ShoppingProject.Application.Common.Constants;

/// <summary>
/// Standardized error codes for consistent error handling across the application.
/// Format: E{Category}{Number}
/// Categories:
///   1xxx - Validation Errors
///   2xxx - Authentication/Authorization Errors
///   3xxx - Business Logic Errors
///   4xxx - Not Found Errors
///   5xxx - System/Technical Errors
///   9xxx - External Service Errors
/// </summary>
public static class ErrorCodes
{
    // Validation Errors (1xxx)
    public static class Validation
    {
        /// <summary>
        /// Generic validation error
        /// </summary>
        public const string Generic = "E1000";

        /// <summary>
        /// Field is required
        /// </summary>
        public const string Required = "E1001";

        /// <summary>
        /// Invalid format (email, URL, etc.)
        /// </summary>
        public const string InvalidFormat = "E1002";

        /// <summary>
        /// Value exceeds maximum length
        /// </summary>
        public const string MaxLengthExceeded = "E1003";

        /// <summary>
        /// Value is below minimum length
        /// </summary>
        public const string MinLengthNotMet = "E1004";

        /// <summary>
        /// Value is out of allowed range
        /// </summary>
        public const string OutOfRange = "E1005";

        /// <summary>
        /// Invalid enum value
        /// </summary>
        public const string InvalidEnumValue = "E1006";

        /// <summary>
        /// Duplicate value (unique constraint violation)
        /// </summary>
        public const string DuplicateValue = "E1007";

        /// <summary>
        /// Invalid date range (start date after end date)
        /// </summary>
        public const string InvalidDateRange = "E1008";

        /// <summary>
        /// File size exceeds limit
        /// </summary>
        public const string FileTooLarge = "E1009";

        /// <summary>
        /// Invalid file type
        /// </summary>
        public const string InvalidFileType = "E1010";
    }

    // Authentication/Authorization Errors (2xxx)
    public static class Auth
    {
        /// <summary>
        /// Authentication failed (invalid credentials)
        /// </summary>
        public const string AuthenticationFailed = "E2001";

        /// <summary>
        /// Token is expired
        /// </summary>
        public const string TokenExpired = "E2002";

        /// <summary>
        /// Token is invalid
        /// </summary>
        public const string InvalidToken = "E2003";

        /// <summary>
        /// Refresh token is invalid or expired
        /// </summary>
        public const string InvalidRefreshToken = "E2004";

        /// <summary>
        /// User account is locked
        /// </summary>
        public const string AccountLocked = "E2005";

        /// <summary>
        /// User account is disabled
        /// </summary>
        public const string AccountDisabled = "E2006";

        /// <summary>
        /// Insufficient permissions
        /// </summary>
        public const string Forbidden = "E2007";

        /// <summary>
        /// Resource access denied
        /// </summary>
        public const string AccessDenied = "E2008";

        /// <summary>
        /// API key is missing
        /// </summary>
        public const string ApiKeyMissing = "E2009";

        /// <summary>
        /// API key is invalid
        /// </summary>
        public const string InvalidApiKey = "E2010";

        /// <summary>
        /// Session expired
        /// </summary>
        public const string SessionExpired = "E2011";

        /// <summary>
        /// Too many failed login attempts
        /// </summary>
        public const string TooManyLoginAttempts = "E2012";
    }

    // Business Logic Errors (3xxx)
    public static class Business
    {
        /// <summary>
        /// Generic business rule violation
        /// </summary>
        public const string RuleViolation = "E3001";

        /// <summary>
        /// Insufficient stock
        /// </summary>
        public const string InsufficientStock = "E3002";

        /// <summary>
        /// Product is out of stock
        /// </summary>
        public const string OutOfStock = "E3003";

        /// <summary>
        /// Cart is empty
        /// </summary>
        public const string EmptyCart = "E3004";

        /// <summary>
        /// Order cannot be cancelled
        /// </summary>
        public const string OrderCannotBeCancelled = "E3005";

        /// <summary>
        /// Invalid operation for current state
        /// </summary>
        public const string InvalidState = "E3006";

        /// <summary>
        /// Concurrent modification detected
        /// </summary>
        public const string ConcurrentModification = "E3007";

        /// <summary>
        /// Operation timeout
        /// </summary>
        public const string OperationTimeout = "E3008";

        /// <summary>
        /// Rate limit exceeded
        /// </summary>
        public const string RateLimitExceeded = "E3009";
    }

    // Not Found Errors (4xxx)
    public static class NotFound
    {
        /// <summary>
        /// Generic resource not found
        /// </summary>
        public const string Generic = "E4001";

        /// <summary>
        /// Product not found
        /// </summary>
        public const string Product = "E4002";

        /// <summary>
        /// Cart item not found
        /// </summary>
        public const string Cart = "E4003";

        /// <summary>
        /// User not found
        /// </summary>
        public const string User = "E4004";

        /// <summary>
        /// Order not found
        /// </summary>
        public const string Order = "E4005";

        /// <summary>
        /// Category not found
        /// </summary>
        public const string Category = "E4006";

        /// <summary>
        /// Feature flag not found
        /// </summary>
        public const string FeatureFlag = "E4007";

        /// <summary>
        /// Endpoint not found
        /// </summary>
        public const string Endpoint = "E4008";
    }

    // System/Technical Errors (5xxx)
    public static class System
    {
        /// <summary>
        /// Internal server error
        /// </summary>
        public const string InternalError = "E5000";

        /// <summary>
        /// Database connection error
        /// </summary>
        public const string DatabaseConnection = "E5001";

        /// <summary>
        /// Database timeout
        /// </summary>
        public const string DatabaseTimeout = "E5002";

        /// <summary>
        /// Cache service unavailable
        /// </summary>
        public const string CacheUnavailable = "E5003";

        /// <summary>
        /// Message queue error
        /// </summary>
        public const string MessageQueueError = "E5004";

        /// <summary>
        /// Serialization error
        /// </summary>
        public const string SerializationError = "E5005";

        /// <summary>
        /// Configuration error
        /// </summary>
        public const string ConfigurationError = "E5006";

        /// <summary>
        /// File system error
        /// </summary>
        public const string FileSystemError = "E5007";

        /// <summary>
        /// Memory limit exceeded
        /// </summary>
        public const string MemoryLimitExceeded = "E5008";

        /// <summary>
        /// Service unavailable
        /// </summary>
        public const string ServiceUnavailable = "E5009";
    }

    // External Service Errors (9xxx)
    public static class External
    {
        /// <summary>
        /// External service unavailable
        /// </summary>
        public const string ServiceUnavailable = "E9001";

        /// <summary>
        /// External service timeout
        /// </summary>
        public const string ServiceTimeout = "E9002";

        /// <summary>
        /// External service returned error
        /// </summary>
        public const string ServiceError = "E9003";

        /// <summary>
        /// Payment gateway error
        /// </summary>
        public const string PaymentGatewayError = "E9004";

        /// <summary>
        /// Email service error
        /// </summary>
        public const string EmailServiceError = "E9005";

        /// <summary>
        /// SMS service error
        /// </summary>
        public const string SmsServiceError = "E9006";

        /// <summary>
        /// Storage service error
        /// </summary>
        public const string StorageServiceError = "E9007";
    }
}

/// <summary>
/// Error code metadata for detailed error information.
/// </summary>
public static class ErrorCodeMetadata
{
    private static readonly Dictionary<string, ErrorDetails> ErrorDetailsMap = new()
    {
        // Validation
        [ErrorCodes.Validation.Required] = new ErrorDetails("Required", "This field is required."),
        [ErrorCodes.Validation.InvalidFormat] = new ErrorDetails("InvalidFormat", "The provided value format is invalid."),
        [ErrorCodes.Validation.MaxLengthExceeded] = new ErrorDetails("MaxLengthExceeded", "The value exceeds the maximum allowed length."),

        // Auth
        [ErrorCodes.Auth.AuthenticationFailed] = new ErrorDetails("AuthenticationFailed", "Invalid credentials provided."),
        [ErrorCodes.Auth.TokenExpired] = new ErrorDetails("TokenExpired", "Your session has expired. Please log in again."),
        [ErrorCodes.Auth.Forbidden] = new ErrorDetails("Forbidden", "You don't have permission to perform this action."),

        // Not Found
        [ErrorCodes.NotFound.Product] = new ErrorDetails("ProductNotFound", "The requested product was not found."),
        [ErrorCodes.NotFound.Cart] = new ErrorDetails("CartNotFound", "The cart item was not found."),
        [ErrorCodes.NotFound.User] = new ErrorDetails("UserNotFound", "The user was not found."),

        // System
        [ErrorCodes.System.InternalError] = new ErrorDetails("InternalError", "An unexpected error occurred. Please try again later."),
        [ErrorCodes.System.DatabaseConnection] = new ErrorDetails("DatabaseConnection", "Unable to connect to the database."),
    };

    public static ErrorDetails? GetDetails(string errorCode)
    {
        return ErrorDetailsMap.TryGetValue(errorCode, out var details) ? details : null;
    }

    public static string GetDefaultMessage(string errorCode)
    {
        return GetDetails(errorCode)?.DefaultMessage ?? "An error occurred.";
    }
}

public record ErrorDetails(string Code, string DefaultMessage);
