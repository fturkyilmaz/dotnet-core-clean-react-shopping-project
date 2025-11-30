# ShoppingProject - Clean Architecture .NET & React.js Solution

[![.NET CI/CD](https://github.com/YOUR_USERNAME/ShoppingProject/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/ShoppingProject/actions/workflows/dotnet-ci.yml)
[![Docker Build](https://github.com/YOUR_USERNAME/ShoppingProject/actions/workflows/docker-build.yml/badge.svg)](https://github.com/YOUR_USERNAME/ShoppingProject/actions/workflows/docker-build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ShoppingProject&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ShoppingProject)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ShoppingProject&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ShoppingProject)

A modern, scalable e-commerce backend built with .NET 9/10, following Clean Architecture principles, CQRS, and Domain-Driven Design (DDD).

## 🚀 Technology Stack

- **Core Framework**: .NET 9/10 (C#)
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

The solution is organized into four concentric layers:

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

See detailed docs:
- [FIREBASE_ANALYTICS_SETUP.md](./FIREBASE_ANALYTICS_SETUP.md) - Firebase setup and configuration
- [ANALYTICS_INTEGRATION_GUIDE.md](./ANALYTICS_INTEGRATION_GUIDE.md) - Developer integration guide
- [OFFLINE_ARCHITECTURE.md](./OFFLINE_ARCHITECTURE.md) - Offline-first architecture details
- [ADVANCED_CACHING_ANALYTICS.md](./ADVANCED_CACHING_ANALYTICS.md) - Caching and performance optimization

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
