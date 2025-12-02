---
name: "Implementation Walkthrough"
about: "Security, Logging & React Query Migration improvements in ShoppingProject"
title: "[Walkthrough] Security, Logging & React Query Migration"
labels: ["enhancement", "professionalization", "walkthrough"]
assignees: []
---

## 📖 Overview
This issue documents the comprehensive improvements made to the .NET Core Clean Architecture shopping project, covering backend security enhancements, frontend modernization with React Query, and end-to-end testing implementation.

---

## ✅ Completed Items

### Backend
- [x] Correlation ID middleware (CorrelationIdMiddleware.cs, integrated in Program.cs)
- [x] Centralized constants (ConfigurationConstants.cs)
- [x] ErrorType enum integrated into GlobalExceptionHandler
- [x] ApiKeyMiddleware refactored with ProblemDetails + options pattern
- [x] Hardened JWT refresh token flow (SHA256 hashing, rotation, revocation, logging)
- [x] Health checks split into liveness (/health/live) and readiness (/health/ready)
- [x] Hangfire dashboard secured with auth
- [x] CSP enforced (removed unsafe-inline)
- [x] Multi-tenancy support (TenantId in ApplicationUser + JWT claims)
- [x] Controller documentation ([ProducesResponseType], ApiVersion consistency)

### Frontend
- [x] TypeScript strict mode enabled (tsconfig.json)
- [x] React Query integrated (useAuth, useProducts, useCart hooks)
- [x] Pages refactored to use hooks (LoginPage, RegisterPage, HomePage, ProductDetailPage, CategoryPage, CartsPage, AdminDashboard, AddProductPage)
- [x] Deprecated Context API removed (ProductContext, BasketContext, providers)
- [x] Centralized API client with interceptors (axios.ts, auth.api.ts, products.api.ts, carts.api.ts)
- [x] E2E tests implemented with Playwright (auth.spec.ts, homepage.spec.ts, admin.spec.ts, cart.spec.ts)
- [x] Type system fixes (Cart types, UserInfoResponse, Axios response types)

---

## 📊 Remaining Tasks

### Backend
- [ ] Add granular rate limiting policies per endpoint
- [ ] Strengthen CORS policy (no wildcard, minimal headers/methods)
- [ ] Expand OpenTelemetry instrumentation (DB, Redis, RabbitMQ)
- [ ] Add Polly resilience policies (retry, circuit breaker, timeout)
- [ ] RabbitMQ DLQ + poison message handling

### Testing & CI/CD
- [ ] Add Testcontainers-based integration tests
- [ ] Enhance GitHub Actions pipeline (cache, SonarQube, Docker scan)

### Deployment & Documentation
- [ ] Helm deploy with environment-specific values
- [ ] Document environment setup
- [ ] Add Architecture Decision Records (ADRs)

---

## 🎯 Key Achievements
- **Security:** SHA256 refresh tokens, correlation ID tracing, RFC-compliant error responses, CSP enforcement.
- **Frontend:** React Query migration, strict TypeScript, centralized API client, E2E test coverage.
- **Developer Experience:** Centralized constants, Swagger documentation, deprecated code cleanup.

---

## 📝 Breaking Changes
- **JWT Refresh Tokens:** Existing tokens invalidated; users must re-authenticate.
- **CSP Headers:** Inline scripts/styles blocked; must be externalized.

---

## 🔍 Verification Checklist
- [ ] Test authentication flow (login → token refresh → logout)
- [ ] Verify correlation IDs in error responses
- [ ] Check health endpoints (/health/live, /health/ready)
- [ ] Test cart operations (add, update, remove, purchase)
- [ ] Verify CSP headers in browser DevTools
