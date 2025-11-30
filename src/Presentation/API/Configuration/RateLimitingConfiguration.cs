using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace ShoppingProject.WebApi.Configuration;

public static class RateLimitingConfiguration
{
    public static IServiceCollection AddCustomRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            // Global rate limit
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
            {
                var userIdentifier =
                    context.User.Identity?.Name
                    ?? context.Connection.RemoteIpAddress?.ToString()
                    ?? "anonymous";

                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: userIdentifier,
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 100,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 10,
                    }
                );
            });

            // Specific policy for authentication endpoints
            options.AddPolicy(
                "auth",
                context =>
                {
                    var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetSlidingWindowLimiter(
                        partitionKey: ipAddress,
                        factory: _ => new SlidingWindowRateLimiterOptions
                        {
                            PermitLimit = 5,
                            Window = TimeSpan.FromMinutes(1),
                            SegmentsPerWindow = 4,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 2,
                        }
                    );
                }
            );

            // Policy for API endpoints
            options.AddPolicy(
                "api",
                context =>
                {
                    var userIdentifier =
                        context.User.Identity?.Name
                        ?? context.Connection.RemoteIpAddress?.ToString()
                        ?? "anonymous";

                    return RateLimitPartition.GetTokenBucketLimiter(
                        partitionKey: userIdentifier,
                        factory: _ => new TokenBucketRateLimiterOptions
                        {
                            TokenLimit = 50,
                            ReplenishmentPeriod = TimeSpan.FromMinutes(1),
                            TokensPerPeriod = 50,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 10,
                        }
                    );
                }
            );

            // Policy for expensive operations
            options.AddPolicy(
                "expensive",
                context =>
                {
                    var userIdentifier = context.User.Identity?.Name ?? "anonymous";

                    return RateLimitPartition.GetConcurrencyLimiter(
                        partitionKey: userIdentifier,
                        factory: _ => new ConcurrencyLimiterOptions
                        {
                            PermitLimit = 2,
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 5,
                        }
                    );
                }
            );

            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    await context.HttpContext.Response.WriteAsync(
                        $"Too many requests. Please try again after {retryAfter.TotalSeconds} seconds.",
                        cancellationToken
                    );
                }
                else
                {
                    await context.HttpContext.Response.WriteAsync(
                        "Too many requests. Please try again later.",
                        cancellationToken
                    );
                }
            };
        });

        return services;
    }
}
