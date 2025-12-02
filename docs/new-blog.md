Implementation Plan: Security, Logging & Architectural Improvements
Overview
This implementation addresses critical security, logging, and architectural improvements across the .NET Core Clean Architecture shopping project. The changes enhance error handling, authentication security, observability, and frontend robustness.

User Review Required
IMPORTANT

Refresh Token Security Enhancement

Implementing SHA256 hashing for refresh tokens stored in the database
This is a breaking change - existing refresh tokens will be invalidated
Users will need to re-authenticate after deployment
WARNING

Content Security Policy (CSP) Hardening

Removing unsafe-inline from CSP headers
May break inline scripts/styles if any exist in the frontend
Requires verification that all scripts/styles are externalized
IMPORTANT

Hangfire Dashboard Production Access

Currently open in production without authentication
Will add authentication requirement or disable in production
Decision needed: Should we add basic auth, JWT auth, or disable completely in production?
Proposed Changes
Backend Components
Infrastructure Layer
[MODIFY] 

ConfigurationConstants.cs
Add new constant classes for RFC types and CorrelationId:


RfcTypes
 class with all RFC 7231/7235 links
CorrelationId class with header name constant
Rationale: Centralize all magic strings to improve maintainability and prevent typos.

[MODIFY] 

ApplicationUser.cs
Add TenantId property for multi-tenancy support:

public string? TenantId { get; set; }
Rationale: Enable future multi-tenancy features and include in JWT claims.

[MODIFY] 

IdentityService.cs
Major security and logging improvements:

Add ILogger dependency for tracking authentication events
Implement refresh token hashing using SHA256 before storing in database
Update refresh token expiry on each refresh operation
Expand JWT claims to include CorrelationId and TenantId
Add comprehensive logging:
Failed login attempts with email (for security monitoring)
Invalid refresh token usage with user ID
Successful authentication events
Add helper method HashRefreshToken() for secure token storage
Add helper method VerifyRefreshToken() for token comparison
Security Impact: Prevents refresh token theft from database breaches.

[NEW] 

CorrelationIdMiddleware.cs
Create middleware to:

Extract or generate X-Correlation-Id header
Store in HttpContext.Items for access throughout request pipeline
Add to response headers for client tracking
Enable distributed tracing across microservices
Rationale: Essential for debugging distributed systems and tracking requests across services.

[MODIFY] 

DatabaseBackupJob.cs
Enhancements:

Add correlation ID to logging context
Job will inherit correlation ID from Hangfire context
Rationale: Improve job traceability and debugging.

Presentation Layer (API)
[MODIFY] 

GlobalExceptionHandler.cs
Improvements:

Extract CorrelationId from HttpContext.Items
Add to ProblemDetails extensions: problem.Extensions["correlationId"]
Use ConfigurationConstants.RfcTypes instead of Application.Common.Constants.RfcTypes
Rationale: Provide correlation ID in error responses for better client-side debugging.

[MODIFY] 

ApiKeyMiddleware.cs
Enhancements:

Add ILogger<ApiKeyMiddleware> dependency
Log unauthorized attempts: _logger.LogWarning("Unauthorized API access attempt from {IpAddress}", context.Connection.RemoteIpAddress)
Use ConfigurationConstants.RfcTypes.Unauthorized for RFC link
Add CorrelationId to ProblemDetails response
Rationale: Security monitoring and audit trail for unauthorized access attempts.

[MODIFY] 

Program.cs
Multiple improvements:

Add CorrelationIdMiddleware early in pipeline (before authentication)

app.UseMiddleware<CorrelationIdMiddleware>();
Split Health Checks:

/health/live - Liveness probe (always returns healthy if app is running)
/health/ready - Readiness probe (checks database, Redis, RabbitMQ)
Secure Hangfire Dashboard:

if (!app.Environment.IsProduction())
{
    app.UseHangfireDashboard(...);
}
// OR add authorization filter in production
Improve CSP Headers:

Remove unsafe-inline from script-src and style-src
Add specific CDN domains if needed
Use nonces or hashes for inline scripts
Add Retry Policy to Hangfire Jobs:

RecurringJob.AddOrUpdate<DatabaseBackupJob>(
    "database-backup",
    job => job.RunAsync(),
    Cron.Daily,
    new RecurringJobOptions { RetryAttempts = 3 }
);
Rationale: Production-grade observability, security, and reliability.

[MODIFY] Controllers
Apply to all controllers (

IdentityController
, ProductsController, CartsController, CacheController, SseController):

Add ProducesResponseType attributes:

[ProducesResponseType(typeof(ServiceResult<T>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
Ensure consistent ApiVersion:

[ApiVersion("1.0")]
Rationale: Better Swagger documentation and API contract clarity.

Frontend Components
[VERIFY] 

tsconfig.json
✅ Already has "strict": true enabled
No changes needed
[MODIFY] API Integration
Current State: Using plain fetch/axios Target State: React Query with caching, retry, and background refetch

Changes needed:

Install @tanstack/react-query
Create QueryClientProvider wrapper in 

App.tsx
Convert API hooks to use useQuery and useMutation
Configure retry policy and stale time
Benefits: Automatic caching, background refetching, optimistic updates, better UX.

[NEW] JWT Refresh Flow
Create Axios interceptor for automatic token refresh:

Create src/api/axiosInstance.ts:

Configure base URL
Add request interceptor to attach access token
Add response interceptor to catch 401 errors
Automatically call refresh token endpoint
Retry original request with new token
Logout if refresh fails
Update authentication context:

Store access token and refresh token
Expose refresh function
Handle token expiry
Rationale: Seamless user experience without forced re-login when access token expires.

[NEW] E2E Tests
Setup Playwright for end-to-end testing:

Install Playwright: npm install -D @playwright/test
Create test scenarios:
tests/auth.spec.ts - Login, registration, logout
tests/cart.spec.ts - Add to cart, update quantity, remove items
tests/checkout.spec.ts - Complete purchase flow
Configure CI/CD to run tests before deployment
Rationale: Catch regressions early and ensure critical user flows work.

Verification Plan
Automated Tests
Backend Unit Tests:

dotnet test
Verify IdentityService refresh token hashing
Test CorrelationIdMiddleware extraction/generation
Validate GlobalExceptionHandler includes correlation ID
Backend Integration Tests:

dotnet test --filter Category=Integration
Test full authentication flow with hashed refresh tokens
Verify health check endpoints return correct status
Test Hangfire job retry policy
Frontend Tests:

cd src/Presentation/Web
npm run test
npm run test:e2e
Run existing unit tests
Execute new Playwright E2E tests
Manual Verification
Test Authentication Flow:

Login with valid credentials
Verify access token and refresh token returned
Wait for access token expiry
Verify automatic refresh works
Check that old refresh token is invalidated
Test Error Responses:

Trigger various errors (404, 401, 400, 500)
Verify ProblemDetails includes correlationId and errorType
Check that correlation ID matches across logs
Test Health Checks:

Access /health/live - should always return 200
Access /health/ready - should return 200 when all dependencies healthy
Stop Redis/PostgreSQL - verify /health/ready returns 503
Test CSP Headers:

Open browser DevTools
Check for CSP violations in console
Verify no inline scripts/styles are blocked
Test Hangfire Dashboard:

In development: verify dashboard is accessible
In production: verify dashboard requires authentication or is disabled
Performance Testing
Load test authentication endpoints:

# Using Apache Bench or k6
ab -n 1000 -c 10 https://localhost:5001/api/v1/identity/login
Monitor correlation ID overhead:

Measure response time before/after CorrelationIdMiddleware
Should be negligible (<1ms)
Security Testing
Verify refresh token hashing:

Check database - refresh tokens should be hashed (not plaintext)
Attempt to use plaintext token - should fail
Test API key logging:

Send request with invalid API key
Verify warning logged with IP address
Test CSP headers:

Use browser security scanner
Verify no unsafe-inline in production