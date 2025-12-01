# 2. Caching Strategy

Date: 2025-12-01

## Status
Accepted

## Context
High-traffic endpoints, such as product listings and details, can put significant load on the database. To ensure low latency and high throughput, we need an effective caching strategy. We also need to handle cache invalidation to ensure users don't see stale data for too long.

## Decision
We have adopted a multi-level caching strategy:

1.  **Response Caching (Client-Side/Middleware)**:
    -   Using `ResponseCachingMiddleware` to set HTTP cache headers (`Cache-Control`).
    -   Allows browsers and intermediate proxies to cache responses.

2.  **Output Caching (Server-Side)**:
    -   Using ASP.NET Core `OutputCache` for storing generated HTML/JSON responses.
    -   **Policies**:
        -   `ProductsList`: Caches the product listing for 2 minutes. Tagged with `products`.
        -   `ProductDetail`: Caches individual product details for 5 minutes. Tagged with `products`.
    -   **Invalidation**: We use cache tags (`AppConstants.CacheTags.Products`) to evict cache entries when a product is created, updated, or deleted.

3.  **Distributed Caching (Data Layer)**:
    -   Using **Redis** via `IDistributedCache` (StackExchange.Redis).
    -   Used for sharing cache state across multiple instances of the application (e.g., for session data or shared data queries).

## Consequences

### Positive
-   **Performance**: Significantly reduced response times for read-heavy endpoints.
-   **Scalability**: Reduced database load allows the system to handle more concurrent users.
-   **Flexibility**: Tag-based eviction allows precise invalidation of related cache entries.

### Negative
-   **Consistency**: There is a small window of eventual consistency where users might see stale data (up to the cache duration).
-   **Complexity**: Requires careful management of cache keys and eviction policies.
-   **Dependency**: Adds a dependency on Redis for distributed scenarios.
