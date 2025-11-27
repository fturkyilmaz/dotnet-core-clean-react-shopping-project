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
}
