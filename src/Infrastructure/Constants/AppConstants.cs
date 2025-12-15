namespace ShoppingProject.Infrastructure.Constants;

public static class AppConstants
{
    public static class CorsPolicies
    {
        public const string AllowReactApp = "AllowReactApp";
    }

    public static class CachePolicies
    {
        public const string ProductsList = "ProductsList";
        public const string ProductDetail = "ProductDetail";
    }

    public static class CacheTags
    {
        public const string Products = "products";
    }

    public static class HealthCheckNames
    {
        public const string Elasticsearch = "elasticsearch";
    }

    public static class JobIds
    {
        public const string DatabaseBackup = "database-backup";
    }

    public static class Metrics
    {
        public const string AspNetCoreHosting = "Microsoft.AspNetCore.Hosting";
        public const string Kestrel = "Microsoft.AspNetCore.Server.Kestrel";
    }

    public static class Endpoints
    {
        public const string HangfireDashboard = "/hangfire";
        public const string HealthCheck = "/health";
        public const string HealthCheckUI = "/health-ui";
        public const string NotificationHub = "/hubs/notifications";
        public const string CartHub = "/hubs/cart";
        public const string OrderHub = "/hubs/orders";
    }

    public static class SecurityHeaders
    {
        public const string StrictTransportSecurity = "Strict-Transport-Security";
        public const string StrictTransportSecurityValue = "max-age=31536000; includeSubDomains";
        public const string XContentTypeOptions = "X-Content-Type-Options";
        public const string XContentTypeOptionsValue = "nosniff";
        public const string XFrameOptions = "X-Frame-Options";
        public const string XFrameOptionsValue = "DENY";
        public const string XXssProtection = "X-XSS-Protection";
        public const string XXssProtectionValue = "1; mode=block";
        public const string ContentSecurityPolicy = "Content-Security-Policy";
        public const string ContentSecurityPolicyValue =
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'";
        public const string ReferrerPolicy = "Referrer-Policy";
        public const string ReferrerPolicyValue = "strict-origin-when-cross-origin";
        public const string PermissionsPolicy = "Permissions-Policy";
        public const string PermissionsPolicyValue =
            "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";
    }
}
