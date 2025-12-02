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

### Deployment & Documentation
- [ ] Helm deploy with environment-specific values  
- [ ] Document environment setup  
- [ ] Add Architecture Decision Records (ADRs)  

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
- [ ] Verify CSP headers in browser DevTools  
