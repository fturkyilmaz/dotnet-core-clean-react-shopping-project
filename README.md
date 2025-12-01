# ShoppingProject - Clean Architecture .NET & React.js & React Native Solution

## 📚 Project Overview

This is a full-stack e-commerce application built with .NET Core 9/10, React.js, and React Native. The project follows Clean Architecture principles, CQRS, and Domain-Driven Design (DDD).

## 🚀 Technology Stack

- **Core Framework**: .NET 9/10 (C#)
- **Frontend**: React.js, React Native, Tailwind, Redux Toolkit, Firebase, Context API, React Query, Nativewind
- **Architecture**: Clean Architecture, CQRS (MediatR)
- **Database**: PostgreSQL (Entity Framework Core)
- **Caching**: Redis (Distributed Cache)
- **Messaging**: RabbitMQ (MassTransit)
- **Background Jobs**: Hangfire
- **Logging & Observability**: ELK Stack (Elasticsearch, Logstash, Kibana), Serilog
- **Monitoring**: Health Checks, Health Checks UI
- **Validation**: FluentValidation
- **Object Mapping**: AutoMapper
- **API Documentation**: Swagger / OpenAPI
- **Testing**: xUnit, Moq, FluentAssertions

## 🏗️ Architecture Overview

The solution is organized into four concentric layers. For a detailed deep-dive into the system design, data models, and technology choices, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

1.  **Domain**: Enterprise logic, Entities, Value Objects, Domain Events, Repository Interfaces. (No dependencies)
2.  **Application**: Business logic, Use Cases (CQRS Commands/Queries), DTOs, Validators. (Depends on Domain)
3.  **Infrastructure**: Implementation of interfaces (EF Core, Repositories, Services), External integrations. (Depends on Application)
4.  **WebApi**: API Controllers, Middleware, Entry Point. (Depends on Application & Infrastructure)

## 📂 Project Structure

```
ShoppingProject/
├── Domain/             # Enterprise/domain entities & business rules
├── Application/        # Business logic & use cases
├── Infrastructure/     # External concerns (database, file systems, etc.)
├── WebApi/             # User interface & API endpoints
├── Web/                # Frontend React.js application
└── UnitTests/          # Unit tests for all layers
```

## ✨ Key Features

- **CQRS Pattern**: Separation of Read and Write operations using MediatR.
- **Domain Events**: Decoupled business logic using event-driven architecture.
- **Event Bus**: Asynchronous communication via RabbitMQ (e.g., Cart Created events).
- **Centralized Logging**: Structured logging with Serilog pushing to Elasticsearch/Kibana.
- **Health Monitoring**: Real-time health checks for Database, Redis, RabbitMQ, and APIs.
- **Background Processing**: Reliable background jobs using Hangfire.
- **Global Exception Handling**: Centralized error handling and standardized API responses.
- **API Versioning**: Support for multiple API versions.

## 🗄️ Database Configuration

The project uses **PostgreSQL** as the primary database and **Redis** for caching.

- **Connection Strings**: Configured in `appsettings.json`.
- **Migrations**: Managed via Entity Framework Core.
- **Seeding**: Automatic seeding of initial data on startup.

## 🛠️ Getting Started

### Prerequisites

- **Docker Desktop** (Required for infrastructure)
- **.NET 9.0 SDK** (or later)

### Infrastructure Setup

Start all required services (PostgreSQL, Redis, RabbitMQ, Elasticsearch, Kibana) using Docker Compose:

```bash
docker compose up -d
```

### Azure Resources Setup
To deploy this application to Azure, you will need the following resources:
1.  **Azure App Service** (Linux Plan) for hosting the Web API.
2.  **Azure Database for PostgreSQL** (Flexible Server recommended).
3.  **Azure Cache for Redis** (Basic tier is sufficient for dev).
4.  **Azure Service Bus** (Standard tier) or keep using RabbitMQ on a VM/Container.
5.  **Application Insights** for monitoring.

### Environment Variables
Ensure the following variables are set in `appsettings.json` or your environment:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `ConnectionStrings__DefaultConnection` | PostgreSQL Connection | `Host=localhost;Database=ShopDb;...` |
| `ConnectionStrings__RedisConnection` | Redis Connection | `localhost:6379` |
| `JwtOptions__Secret` | JWT Signing Key | `super-secret-key-min-32-chars` |
| `JwtOptions__Issuer` | Token Issuer | `ShoppingApi` |
| `JwtOptions__Audience` | Token Audience | `ShoppingClient` |
| `ServiceBusOptions__Url` | Message Broker URL | `amqp://guest:guest@localhost:5672` |

### Database Migration

Apply pending migrations to the PostgreSQL database:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update --project src/Infrastructure/ShoppingProject.Infrastructure.csproj --startup-project src/API/ShoppingProject.WebApi.csproj
```

### Running the Application

Run the Web API:

```bash
dotnet run --project src/API/ShoppingProject.WebApi.csproj
```

### Deployment Instructions
1.  **Build Docker Image**:
    ```bash
    docker build -t shopping-api -f Dockerfile .
    ```
2.  **Push to Registry** (e.g., Azure Container Registry):
    ```bash
    docker tag shopping-api myregistry.azurecr.io/shopping-api
    docker push myregistry.azurecr.io/shopping-api
    ```
3.  **Deploy to App Service**:
    -   Create an App Service for Containers.
    -   Point it to your Docker Image.
    -   Set the Environment Variables in the App Service Configuration.

### Running the Mobile App

Navigate to the mobile app directory and start:

```bash
cd src/Presentation/App
yarn install
yarn start
```

## 📱 Mobile Features

### Offline-First Architecture
- **SQLite Database**: Local persistence for products and cart items
- **SyncManager**: Automatic sync when device comes back online
- **Offline Queue**: Operations queued and synced in order

### Analytics & Monitoring
- **Google Analytics**: Comprehensive event tracking
- **Firebase Crashlytics**: Automatic crash detection and reporting
- **Performance Metrics**: Real-time query times and API latency
- **Cache Analytics**: Track cache hit rates and effectiveness

See detailed docs in the [`docs/`](./docs/docs/guides/) folder:
- [Development Setup](./docs/docs/guides/development-setup.md) - Complete local development guide
- [Production Deployment](./docs/docs/guides/production-deployment.md) - Azure and Kubernetes deployment
- [Testing Guide](./docs/docs/guides/testing.md) - Unit, integration, and E2E testing
- [Clean Architecture Refactoring](./docs/docs/guides/clean-architecture-refactoring.md) - Recent architecture improvements
- [Firebase Analytics Setup](./docs/docs/guides/firebase-analytics-setup.md) - Firebase setup and configuration
- [Analytics Integration](./docs/docs/guides/analytics-integration.md) - Developer integration guide
- [Docker Deployment](./docs/docs/guides/docker-deployment.md) - Docker and container guide

## 📊 Observability & Monitoring

### Health Checks UI
Monitor the status of all dependencies (DB, Cache, Broker, etc.):
- URL: `http://localhost:5000/health-ui` (or configured port)

### Kibana (Logs)
View centralized application logs:
- URL: `http://localhost:5601`
- Index Pattern: `shoppingproject-logs-*`

### Hangfire Dashboard
Manage background jobs:
- URL: `http://localhost:5000/hangfire`

### Swagger Documentation
Explore and test API endpoints:
- URL: `http://localhost:5000/swagger`

## 🔌 API Endpoints

### Products (`/api/v1/Products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/`      | Get all products | No |
| GET    | `/{id}`  | Get product by ID | No |
| POST   | `/`      | Create new product | Yes (Admin) |
| PUT    | `/{id}`  | Update product | Yes (Admin) |
| DELETE | `/{id}`  | Delete product | Yes (Admin) |
| POST   | `/search`| Search products with dynamic query | No |

### Carts (`/api/v1/Carts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/`      | Get all carts | No |
| GET    | `/{id}`  | Get cart by ID | No |
| POST   | `/`      | Create new cart | Yes |
| PUT    | `/{id}`  | Update cart | Yes |
| DELETE | `/{id}`  | Delete cart | Yes |

### Identity (`/api/v1/Identity`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/login` | User login | No |
| POST   | `/register` | User registration | No |
| POST   | `/{userId}/assign-admin-role` | Assign admin role to user | No (Dev only) |
| POST   | `/roles/{roleName}` | Create new role | No (Dev only) |

### Cache (`/api/v1/Cache`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/{key}` | Get value from Redis | No |
| POST   | `/set`   | Set value in Redis | No |
| DELETE | `/{key}` | Remove value from Redis | No |

## 🧪 Testing

The project includes comprehensive unit tests and integration tests with **80%+ code coverage** target.

### Run All Tests
```bash
dotnet test
```

### Run Tests with Code Coverage
```bash
dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage
```

### Generate Coverage Report
```bash
# Install report generator tool
dotnet tool install -g dotnet-reportgenerator-globaltool

# Generate HTML report
reportgenerator -reports:"./coverage/**/coverage.cobertura.xml" -targetdir:"./coverage/report" -reporttypes:Html

# Open report
open ./coverage/report/index.html  # macOS
# or
start ./coverage/report/index.html  # Windows
```

### Test Structure
- **Domain Tests**: Entity and value object tests
- **Application Tests**: Command, Query, and Validator tests
- **Infrastructure Tests**: Repository and service tests
- **Integration Tests**: End-to-end API tests

## 📊 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Build & Test**: Runs on every push and pull request
- **Code Coverage**: Automatically calculated and reported
- **SonarQube Analysis**: Code quality and security analysis
- **Docker Build**: Automated container image builds

View the [CI/CD workflows](.github/workflows/) for more details.

## 🙏 Acknowledgments

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin
- [Domain-Driven Design](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) by Eric Evans
- [jasontaylordev/CleanArchitecture](https://github.com/jasontaylordev/CleanArchitecture) for inspiration.

## ⚠️ Known Limitations & Trade-offs
-   **Eventual Consistency**: Due to the asynchronous nature of the Event Bus, updates (like inventory) may not be immediately reflected in all read models.
-   **Complexity**: The microservice-ready architecture (CQRS, Bus, etc.) introduces overhead compared to a simple Monolith.
-   **PostgreSQL Partitioning**: Currently simulated via logical separation; physical partitioning is not yet enabled (see `ARCHITECTURE.md`).
