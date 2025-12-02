namespace ShoppingProject.Infrastructure.Constants;

public static class ConfigurationConstants
{
    public static class ConnectionStrings
    {
        public const string DefaultConnection = "DefaultConnection";
        public const string DefaultConnectionReadOnly = "DefaultConnection_ReadOnly";
        public const string RedisConnection = "RedisConnection";
    }

    public static class JwtSettings
    {
        public const string Issuer = "JwtSettings:Issuer";
        public const string Audience = "JwtSettings:Audience";
        public const string Secret = "JwtSettings:Secret";
    }

    public static class Hangfire
    {
        public const string ConnectionString = "Hangfire:ConnectionString";
        public const string WorkerCount = "Hangfire:WorkerCount";
        public const string DashboardPath = "Hangfire:DashboardPath";
    }

    public static class ServiceBus
    {
        public const string Url = "ServiceBusOption:Url";
    }

    public static class Cors
    {
        public const string AllowedOrigins = "AllowedOrigins";
    }

    public static class RateLimiting
    {
        public const string IpRateLimiting = "IpRateLimiting";
    }

    public static class ApiKey
    {
        public const string HeaderName = "X-Api-Key";
        public const string SectionName = "Authentication:ApiKey";
    }

    /// <summary>
    /// RFC 7231/4918/7235 specification links for standardized ProblemDetails responses.
    /// </summary>
    public static class RfcTypes
    {
        public const string InternalServerError =
            "https://tools.ietf.org/html/rfc7231#section-6.6.1";
        public const string NotFound = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
        public const string Forbidden = "https://tools.ietf.org/html/rfc7231#section-6.5.3";
        public const string BadRequest = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
        public const string Validation = "https://tools.ietf.org/html/rfc4918#section-11.2";
        public const string Unauthorized = "https://tools.ietf.org/html/rfc7235#section-3.1";
    }

    public static class CorrelationId
    {
        public const string HeaderName = "X-Correlation-Id";
        public const string ItemsKey = "CorrelationId";
    }

    public static class Email
    {
        public const string SmtpHost = "Email:SmtpHost";
        public const string SmtpPort = "Email:SmtpPort";
        public const string SmtpUser = "Email:SmtpUser";
        public const string SmtpPass = "Email:SmtpPass";
        public const string From = "Email:From";
        public const string EnableSsl = "Email:EnableSsl";
        public const string ClientUrl = "Email:ClientUrl";
    }
}
