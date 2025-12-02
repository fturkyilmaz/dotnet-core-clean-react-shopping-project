---
name: "Professionalization Task"
about: "Improve architecture, security, observability, and CI/CD in ShoppingProject"
title: "[Professionalization] <short description>"
labels: ["enhancement", "professionalization"]
assignees: []
---

## 🎯 Goal
Describe the professional improvement clearly.

## ✅ Tasks
- [ ] Implement correlation ID middleware and enrich logs
- [ ] Centralize constants (RFC links, header names, config keys)
- [ ] Integrate ErrorType enum into GlobalExceptionHandler
- [ ] Refactor ApiKeyMiddleware with ProblemDetails + options pattern
- [ ] Harden JWT refresh token flow (rotation + revocation list)
- [ ] Add granular rate limiting policies per endpoint
- [ ] Strengthen CORS policy (no wildcard, minimal headers/methods)
- [ ] Enforce CSP (report-only → enforce)
- [ ] Expand OpenTelemetry instrumentation (DB, Redis, RabbitMQ)
- [ ] Split health checks into liveness/readiness
- [ ] Add Polly resilience policies (retry, circuit breaker, timeout)
- [ ] Secure Hangfire dashboard with auth
- [ ] RabbitMQ DLQ + poison message handling
- [ ] Enable TypeScript strict mode in React frontend
- [ ] Integrate React Query for API calls
- [ ] Add centralized API client with interceptors
- [ ] Write E2E tests (Playwright/Cypress)
- [ ] Add Testcontainers-based integration tests
- [ ] Enhance GitHub Actions pipeline (cache, SonarQube, Docker scan)
- [ ] Helm deploy with environment-specific values
- [ ] Document environment setup and add ADRs

## 📌 Notes
- Each checkbox can be split into separate issues if needed.
- Prioritize Sprint 1 tasks first (CorrelationId, constants, ErrorType, ApiKeyMiddleware).


