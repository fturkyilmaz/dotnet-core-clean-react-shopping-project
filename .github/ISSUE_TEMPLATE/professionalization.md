---
name: "Implementation Walkthrough"
about: "Security, Logging & React Query Migration improvements in ShoppingProject"
title: "[Walkthrough] Security, Logging & React Query Migration"
labels: ["enhancement", "professionalization", "walkthrough"]
assignees: []
---

## 📖 Overview
This issue documents the comprehensive improvements made to the .NET Core Clean Architecture shopping project, covering backend security enhancements, frontend modernization with React Query, and end-to-end testing implementation.

## 📊 Remaining Tasks

### Backend
- [ ] Add granular rate limiting policies per endpoint
- [ ] Strengthen CORS policy (no wildcard, minimal headers/methods)
- [ ] Expand OpenTelemetry instrumentation (DB, Redis, RabbitMQ)
- [ ] Add Polly resilience policies (retry, circuit breaker, timeout)
- [ ] RabbitMQ DLQ + poison message handling
- [ ] Refactor all entity, value object, and domain service usages for full DDD (no primitive obsession, explicit value objects, business rules in domain, clear invariants)
- [ ] Consolidate all MediatR behaviors (logging, validation, exception) for DRYness and clarity
- [ ] Enforce single-responsibility principle in all commands/queries/handlers (avoid fat handlers)
- [ ] Ensure error-handling standardized with proper error responses (no ad-hoc throws; use Result/Error wrapper everywhere)
- [ ] Rename and standardize all repository/service interfaces for naming consistency
- [ ] Remove all unused/useless legacy code, DTOs, or mapping spaghetti (especially in Application/DTOs and mapping layers)
- [ ] Rework test coverage: Add/strengthen unit, integration, and API tests for all critical domain and application flows
- [ ] Ensure all API endpoints are RESTful (resource nouns, HTTP codes, no action verbs)
- [ ] Consolidate caching and cache invalidation strategies (consistency, separation between CQRS read/write models)
- [ ] Add XML documenting comments to all public interfaces/classes and configure StyleCop for linting
- [ ] Review migrations, DB context configuration, resilience/retry, and transactional boundaries

#### 🔴 High Priority (kritik, hemen yapılmalı)
- [ ] **Consul & HTTPS Config**  
  - Add `Consul:Host` to config or disable Consul registration in development  
  - Add `httpsPort` in `launchSettings.json` or Kestrel config → fix redirect warning  

- [ ] **Package Management (CPM)**  
  - Remove duplicate `PackageVersion` entries in `Directory.Packages.props`  
  - Add CI pipeline validation step to prevent duplicates  

- [ ] **HealthChecks**  
  - Add FluentValidation for RabbitMQ, Redis, PostgreSQL config → prevent runtime misconfig  

#### 🟠 Medium Priority (önemli, kısa vadede yapılmalı)
- [ ] **HealthChecks UI Storage**  
  - Replace `AddInMemoryStorage()` with `AddPostgreSqlStorage()` or `AddSqlServerStorage()` in production  

- [ ] **Hangfire**  
  - Disable or secure Dashboard in production  
  - Add retry policy + logging for jobs  

- [ ] **RabbitMQ & MassTransit**  
  - Use meaningful queue names → easier debugging  
  - Add Polly retry policy for resilience  

#### 🟢 Low Priority (iyileştirme, uzun vadede yapılmalı)
- [ ] **Observability**  
  - Integrate OpenTelemetry exporter with Prometheus + Grafana  
  - Adjust log levels per environment (Dev → Debug, Prod → Warning/Error)  

- [ ] **MediatR License**  
  - Resolve Lucky Penny license warning → purchase license or migrate to open-source MediatR  

### 🧪 Testing & CI/CD

#### 🔴 High Priority
- [ ] **Integration Tests**
  - Add Testcontainers-based integration tests for PostgreSQL, Redis, RabbitMQ  
  - Ensure tests run in isolated containers → reproducible builds  

#### 🟠 Medium Priority
- [ ] **GitHub Actions Pipeline**
  - Add caching for NuGet packages → faster builds  
  - Integrate SonarQube analysis → code quality & maintainability checks  
  - Add Docker image scanning → security compliance  

#### 🟢 Low Priority
- [ ] **Pipeline Enhancements**
  - Parallelize test jobs → reduce CI time  
  - Add matrix builds for multiple .NET versions  
  - Publish test coverage reports to GitHub Pages or dashboard  

### Frontend (Web/React)
- [ ] Refactor store and API usages for uniformity (use TanStack Query everywhere, avoid ad-hoc fetch/axios in components)
- [ ] Use atomic & presentational/container component separation, memoization and hooks best practices
- [ ] Consolidate theme/context APIs for clarity (move to single context provider per concern)
- [ ] Remove dead/duplicated states or legacy Redux code
- [ ] Strengthen TypeScript typing across all components, hooks, and stores (no implicit anys, type all responses, migrate to stricter tsconfig)
- [ ] Standardize component and file naming conventions
- [ ] Add/improve i18n (localization) and accessibility (ARIA, keyboard navigation support) where missing
- [ ] Add automated a11y tests (Jest/RTL + axe or similar)
- [ ] Review and improve global error boundary and error presentation flows
- [ ] Remove all console.logs/debug code; add error/log tracking SDK if needed
- [ ] Optimize image and bundle loading (use next-gen formats, lazy loading everywhere, preconnect/preload for external assets)
- [ ] Add missing unit, integration and e2e tests; enforce code coverage thresholds

### Mobile (React Native)
- [ ] Standardize all redux slices (naming, async thunk usage, match web logic)
- [ ] Ensure all API requests use a single abstraction/config (avoid repeated base URLs, interceptor duplication)
- [ ] Remove any business logic from components, move to slice/thunk/service
- [ ] Add/strengthen tests for slices, thunks and major screens/components
- [ ] Clean up navigation usage (type safe, deep link capable, single root navigator setup)
- [ ] Add/strengthen error boundaries & loading states for major screens
- [ ] Standardize and optimize all image loading and caching; use responsive images where possible
- [ ] Ensure a11y/voice-over support at least for checkout and critical flows

### Deployment & Documentation
- [ ] Helm deploy with environment-specific values  
- [ ] Document environment setup  
- [ ] Add Architecture Decision Records (ADRs)  
- [ ] Update/expand all READMEs, including API docs, domain model diagrams, developer onboarding  
- [ ] Document all project-wide architectural decisions and best practices in docs/architecture.md  

---

## 🎯 Key Achievements
- **Security:** SHA256 refresh tokens, correlation ID tracing, RFC-compliant error responses, CSP enforcement  
- **Frontend:** React Query migration, strict TypeScript, centralized API client, E2E test coverage  
- **Developer Experience:** Centralized constants, Swagger documentation, deprecated code cleanup  

---

## 📝 Breaking Changes
- **JWT Refresh Tokens:** Existing tokens invalidated; users must re-authenticate  
- **CSP Headers:** Inline scripts/styles blocked; must be externalized  

---

## 🔍 Verification Checklist
- [ ] Test authentication flow (login → token refresh → logout)  
- [ ] Verify correlation IDs in error responses  
- [ ] Check health endpoints (`/health/live`, `/health/ready`)  
- [ ] Test cart operations (add, update, remove, purchase)  
- [ ] Verify CSP headers in browser 