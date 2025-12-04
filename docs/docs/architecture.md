# Architecture Overview
---

### 🏗️ `architecture-overview.md`

```markdown
---
sidebar_position: 3
---

ShoppingProject follows **Clean Architecture** principles with clear separation of concerns.

## Layers

### Domain
- Contains **Entities**, **Value Objects**, and **Domain Services**.
- Business rules and invariants live here.
- Examples: `Product`, `Cart`, `Order`, `User`.

### Application
- Contains **CQRS Handlers** (Commands & Queries).
- Uses **MediatR** for request/response pipeline.
- Validation with **FluentValidation**.
- Defines **DTOs** and **Interfaces** for repositories/services.
- Responsible for orchestrating domain logic without knowing infrastructure details.

### Infrastructure
- Implements repository interfaces using **EF Core**.
- Provides integrations (Redis, RabbitMQ, Email, Consul).
- Handles persistence, caching, and external services.
- Contains configuration for resilience (Polly) and observability (OpenTelemetry).

### Presentation (API)
- ASP.NET Core Web API layer.
- Configures authentication/authorization (JWT, roles, claims).
- Exposes RESTful endpoints.
- Uses Swagger/OpenAPI for documentation.
- Responsible for API contract and API-specific logic.

### Presentation (Mobile)
- React Native layer.
- Unified API layer, type-safe navigation, shared DTOs.
- Responsible for mobile-specific logic.

### Presentation (Web)
- React/Vite layer.
- Unified API layer, type-safe navigation, shared DTOs.
- Responsible for web-specific logic.

## Cross-Cutting Concerns

- **Security**: JWT, refresh tokens, role/claim-based authorization.
- **Resiliency**: Polly policies (retry, circuit breaker, timeout).
- **Observability**: OpenTelemetry, Prometheus, Grafana, Jaeger.
- **Caching**: Redis (cache-aside), output caching.
- **Logging**: Serilog + ELK stack for structured logs.

## Frontend Integration

- **Web (React/Vite)**: Redux Toolkit + TanStack Query, strict TypeScript.
- **Mobile (React Native)**: Unified API layer, type-safe navigation, shared DTOs.
- Both platforms consume consistent DTO contracts from backend.

## Testing Strategy

- **Unit Tests**: Domain invariants and value objects.
- **Integration Tests**: API + DB + Redis + RabbitMQ (Testcontainers).
- **Architecture Tests**: Naming conventions, dependency rules.
- **E2E Tests**: Web and mobile flows with critical path coverage.

---

## Diagram


## High-Level Architecture Diagram

```mermaid
graph TD
    Client[Client Apps (Web/Mobile)] -->|HTTPS| API[Web API]
    API -->|Commands/Queries| App[Application Layer]
    App -->|Domain Logic| Domain[Domain Layer]
    
    subgraph Infrastructure
        App -->|Interfaces| Infra[Infrastructure Layer]
        Infra -->|EF Core| DB[(PostgreSQL)]
        Infra -->|Cache| Redis[(Redis)]
        Infra -->|Events| Bus[RabbitMQ / Azure Service Bus]
        Infra -->|Search| Elastic[(Elasticsearch)]
    end

    subgraph External Services
        Bus -->|Async| Workers[Background Workers]
        Workers -->|Jobs| Hangfire[(Hangfire DB)]
    end
```

## Data Model Design

The application uses a **Relational Data Model** with PostgreSQL, but is designed with future sharding in mind.

### Key Entities & Partitioning Rationale

| Entity | Partition Key | Rationale |
| :--- | :--- | :--- |
| **Product** | `CategoryId` | Products are primarily queried by Category. Partitioning by `CategoryId` ensures efficient single-partition queries for the most common read operations (browsing). |
| **Cart** | `UserId` | Carts are strictly user-scoped. Partitioning by `UserId` guarantees that all cart operations for a user hit a single shard, maximizing performance and consistency. |
| **Order** | `UserId` | Similar to Carts, Orders are accessed by the user who created them. |

### Database Schema (Simplified)
-   **Products**: `Id`, `Name`, `Description`, `Price`, `CategoryId`, `Rating` (Owned Type).
-   **Carts**: `Id`, `UserId`, `Items` (Collection).
-   **Identity**: `AspNetUsers`, `AspNetRoles` (Standard Identity Schema).

## Technology Stack Justification

| Technology | Role | Justification |
| :--- | :--- | :--- |
| **.NET 8/9** | Backend Framework | High performance, strong typing, excellent ecosystem for enterprise apps. |
| **PostgreSQL** | Primary Database | Open-source, robust, supports JSONB for flexible schemas if needed. |
| **Redis** | Caching | Industry standard for distributed caching, low latency. |
| **RabbitMQ** | Message Broker | Reliable, supports complex routing (Pub/Sub), easy to run locally via Docker. |
| **MediatR** | In-Process Messaging | Implements CQRS and Mediator patterns, decoupling Controllers from Business Logic. |
| **FluentValidation** | Validation | Separates validation rules from DTOs, keeping code clean and testable. |
| **Serilog + ELK** | Observability | Structured logging is essential for debugging distributed systems. ELK provides powerful analysis. |

## Design Patterns

### 1. CQRS (Command Query Responsibility Segregation)
-   **Why**: Separates read and write workloads. Allows optimizing queries (e.g., using Dapper or projections) independently of domain-heavy commands.
-   **Implementation**: `IRequest<T>` for Commands/Queries, `IRequestHandler<T, R>` for logic.

### 2. Clean Architecture
-   **Why**: Independent of Frameworks, UI, and Database. The `Domain` is at the center.
-   **Implementation**: 4 Layers (Domain, Application, Infrastructure, Presentation).

### 3. Repository Pattern
-   **Why**: Abstraction over data access. Allows swapping data sources or mocking for tests.
-   **Implementation**: `IRepository<T>` generic interface.

### 4. Outbox Pattern
-   **Why**: Ensures atomic database updates and message publishing.
-   **Implementation**: `OutboxMessage` table stores events in the same transaction as business data. A background job publishes them to the bus.

### 5. Specification Pattern
-   **Why**: Encapsulates query logic (filtering, sorting, paging) into reusable objects.
-   **Implementation**: `ISpecification<T>` used by Repositories to build queries dynamically.

Data Model Design
The application uses a Relational Data Model with PostgreSQL, designed with future sharding in mind.

Key Entities & Partitioning Rationale
Entity	Partition Key	Rationale
Product	CategoryId	Products are queried by category; partitioning ensures efficient reads.
Cart	UserId	Carts are user-scoped; partitioning guarantees single-shard operations.
Order	UserId	Orders are accessed by the user who created them.
Simplified Schema
Products: Id, Name, Description, Price, CategoryId, Rating.

Carts: Id, UserId, Items (Collection).

Identity: AspNetUsers, AspNetRoles, AspNetUserRoles, AspNetUserClaims.

Technology Stack Justification
Technology	Role	Justification
.NET 10	Backend Framework	High performance, strong typing, enterprise-ready ecosystem.
PostgreSQL	Primary Database	Robust, open-source, supports JSONB for flexible schemas.
Redis	Caching	Industry standard for distributed caching, low latency.
RabbitMQ	Message Broker	Reliable, supports Pub/Sub, easy local setup via Docker.
MediatR	In-Process Messaging	Implements CQRS/Mediator, decouples controllers from business logic.
FluentValidation	Validation	Clean separation of validation rules, testable.
Serilog + ELK	Observability	Structured logging, powerful analysis with ELK stack.
Design Patterns
1. CQRS (Command Query Responsibility Segregation)
Why: Separates read and write workloads; optimizes queries independently of domain-heavy commands.

Implementation: IRequest<T> for Commands/Queries, IRequestHandler<T, R> for handlers.

2. Clean Architecture
Why: Keeps Domain independent of frameworks, UI, and DB.

Implementation: 4 Layers (Domain, Application, Infrastructure, Presentation).

3. Repository Pattern
Why: Abstracts data access; enables mocking and swapping data sources.

Implementation: IRepository<T> interfaces implemented in Infrastructure.

4. Outbox Pattern
Why: Ensures atomic DB updates and message publishing.

Implementation: OutboxMessage table + background job publishing to RabbitMQ.

5. Specification Pattern
Why: Encapsulates query logic (filtering, sorting, paging).

Implementation: ISpecification<T> used by repositories to build queries dynamically.
