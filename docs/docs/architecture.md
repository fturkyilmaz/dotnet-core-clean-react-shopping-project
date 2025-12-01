# Architecture Overview

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
