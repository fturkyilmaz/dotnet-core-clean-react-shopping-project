using Microsoft.Extensions.Logging;
using Polly;
using Polly.CircuitBreaker;
using Polly.Fallback;
using Polly.Retry;
using Polly.Timeout;
using ShoppingProject.Infrastructure.Common.Exceptions;

namespace ShoppingProject.Infrastructure.Resilience;

public static class ResiliencePolicies
{
    /// <summary>
    /// Creates a resilience pipeline with retry, circuit breaker, and timeout policies
    /// </summary>
    public static IAsyncPolicy<TResult> CreateResiliencePipeline<TResult>(
        ILogger logger,
        int retryCount = 3,
        int circuitBreakerThreshold = 5,
        TimeSpan? circuitBreakerDuration = null,
        TimeSpan? timeout = null
    )
    {
        var breakerDuration = circuitBreakerDuration ?? TimeSpan.FromSeconds(30);
        var timeoutDuration = timeout ?? TimeSpan.FromSeconds(10);

        // Retry policy with exponential backoff
        var retryPolicy = Policy<TResult>
            .Handle<Exception>(ex => !(ex is BrokenCircuitException))
            .WaitAndRetryAsync(
                retryCount,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                onRetry: (outcome, timespan, retryAttempt, context) =>
                {
                    logger.LogWarning(
                        outcome.Exception,
                        "Retry {RetryAttempt} after {Delay}s due to {Message}",
                        retryAttempt,
                        timespan.TotalSeconds,
                        outcome.Exception?.Message
                    );
                }
            );

        // Circuit breaker policy
        var circuitBreakerPolicy = Policy<TResult>
            .Handle<Exception>()
            .CircuitBreakerAsync(
                handledEventsAllowedBeforeBreaking: circuitBreakerThreshold,
                durationOfBreak: breakerDuration,
                onBreak: (outcome, duration) =>
                {
                    logger.LogError(
                        outcome.Exception,
                        "Circuit breaker opened for {Duration}s due to {Message}",
                        duration.TotalSeconds,
                        outcome.Exception?.Message
                    );
                },
                onReset: () =>
                {
                    logger.LogInformation("Circuit breaker reset");
                },
                onHalfOpen: () =>
                {
                    logger.LogInformation("Circuit breaker half-open, testing...");
                }
            );

        // Timeout policy
        var timeoutPolicy = Policy.TimeoutAsync<TResult>(
            timeoutDuration,
            TimeoutStrategy.Pessimistic
        );

        // Combine policies: timeout -> retry -> circuit breaker
        return Policy.WrapAsync(circuitBreakerPolicy, retryPolicy, timeoutPolicy);
    }

    /// <summary>
    /// Creates a fallback policy for graceful degradation
    /// </summary>
    public static IAsyncPolicy<TResult> CreateFallbackPolicy<TResult>(
        Func<CancellationToken, Task<TResult>> fallbackAction
    )
    {
        return Policy<TResult>.Handle<Exception>().FallbackAsync((ct) => fallbackAction(ct));
    }

    /// <summary>
    /// Creates a bulkhead isolation policy to limit concurrent executions
    /// </summary>
    public static IAsyncPolicy CreateBulkheadPolicy(
        ILogger logger,
        int maxParallelization = 10,
        int maxQueuingActions = 20
    )
    {
        return Policy.BulkheadAsync(
            maxParallelization: maxParallelization,
            maxQueuingActions: maxQueuingActions,
            onBulkheadRejectedAsync: context =>
            {
                logger.LogWarning("Bulkhead rejected - too many concurrent requests");
                return Task.CompletedTask;
            }
        );
    }
}

/// <summary>
/// Example service using resilience policies
/// </summary>
public class ResilientHttpService
{
    private readonly HttpClient _httpClient;
    private readonly IAsyncPolicy<HttpResponseMessage> _resiliencePolicy;
    private readonly ILogger<ResilientHttpService> _logger;

    public ResilientHttpService(HttpClient httpClient, ILogger<ResilientHttpService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        // Create resilience pipeline with logger
        _resiliencePolicy = ResiliencePolicies.CreateResiliencePipeline<HttpResponseMessage>(
            _logger,
            retryCount: 3,
            circuitBreakerThreshold: 5,
            circuitBreakerDuration: TimeSpan.FromSeconds(30),
            timeout: TimeSpan.FromSeconds(10)
        );
    }

    public async Task<T?> GetAsync<T>(string url, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _resiliencePolicy.ExecuteAsync(async () =>
            {
                _logger.LogInformation("Making HTTP GET request to {Url}", url);
                return await _httpClient.GetAsync(url, cancellationToken);
            });

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            return System.Text.Json.JsonSerializer.Deserialize<T>(content);
        }
        catch (BrokenCircuitException ex)
        {
            _logger.LogError(ex, "Circuit breaker is open for {Url}", url);
            throw new InfrastructureException($"Circuit breaker open for {url}", ex);
        }
        catch (TimeoutRejectedException ex)
        {
            _logger.LogError(ex, "Request timeout for {Url}", url);
            throw new InfrastructureException($"Request timeout for {url}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error making request to {Url}", url);
            throw new InfrastructureException($"Error making request to {url}", ex);
        }
    }
}
