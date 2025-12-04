---
sidebar_position: 1
---

# Introduction

Welcome to the **ShoppingProject** documentation!

This project is a modern, full-stack E-commerce solution built with **.NET 10** on the backend and **React/React Native** on the frontend. It follows Clean Architecture principles and is designed to be scalable, maintainable, and microservices-ready.

## Features

### 🏗️ Architecture
- **Clean Architecture**: Clear separation of concerns with Domain, Application, Infrastructure, and API layers.
- **CQRS + MediatR**: Command Query Responsibility Segregation for testability and single responsibility.
- **DDD Practices**: Value Objects, Aggregates, and Domain Services for business logic consistency.

### 🔐 Security
- **JWT Authentication & Refresh Tokens** with SHA256 hashing
- **Role & Claims-based Authorization**
- **API Key Authentication** for service-to-service communication
- **Rate Limiting** policies per endpoint

### ⚙️ Microservices Patterns
- **API Gateway** with YARP
- **Service Discovery** via Consul
- **Resiliency** using Polly (retry, circuit breaker, timeout)

### 📊 Monitoring & Observability
- **OpenTelemetry** tracing & metrics
- **Prometheus & Grafana** dashboards
- **Jaeger** distributed tracing
- **Centralized Logging** with Serilog

### 🚀 Performance
- **Redis Caching** (Cache-Aside pattern)
- **Output Caching** for API responses
- **Optimized EF Core** queries and transactional boundaries

### 🌐 Frontend Integration
- **React (Web)** with Vite, Redux Toolkit, and TanStack Query
- **React Native (Mobile)** with unified API layer and type-safe navigation
- **Shared DTOs & Contracts** between backend and frontend for consistency
- **Accessibility & i18n** support

### 🧪 Testing
- **Unit Tests** for domain invariants
- **Integration Tests** with Testcontainers (PostgreSQL, Redis, RabbitMQ)
- **End-to-End Tests** for web and mobile flows
- **Architecture Tests** enforcing naming conventions and dependencies

---

## 📂 Repository

You can find the full source code here:  
👉 [ShoppingProject GitHub Repository](https://github.com/fturkyilmaz/dotnet-core-clean-react-shopping-project)

---

## 🎯 Goal

The goal of ShoppingProject is to provide a **production-grade, developer-friendly E-commerce boilerplate** that demonstrates best practices in:
- Clean Architecture
- Domain-Driven Design
- Secure authentication/authorization
- Scalable frontend/backend integration
- Modern DevOps workflows
