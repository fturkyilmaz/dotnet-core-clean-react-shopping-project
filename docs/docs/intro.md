---
sidebar_position: 1
---

# Shopping Project API Documentation

Welcome to the **Shopping Project API** documentation! This is a modern e-commerce API built with **.NET 10**, **Clean Architecture**, and **CQRS** pattern.

## 🚀 Quick Start

Get started with the Shopping Project API in just a few minutes:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ShoppingProject.git
   cd ShoppingProject
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the API**
   - API: `http://localhost:5000`
   - Swagger UI: `http://localhost:5000/swagger`
   - Hangfire Dashboard: `http://localhost:5000/hangfire`
   - Health Checks: `http://localhost:5000/health-ui`

## 📚 What's Included

- **RESTful API** with versioning support
- **JWT Authentication** with role-based authorization
- **PostgreSQL** database with Entity Framework Core
- **Redis** caching for improved performance
- **RabbitMQ** message queue for event-driven architecture
- **Hangfire** for background job processing
- **ELK Stack** integration for centralized logging
- **Rate Limiting** to protect against abuse
- **Security Headers** following OWASP best practices

## 🏗️ Architecture

The project follows **Clean Architecture** principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and business rules (CQRS with MediatR)
- **Infrastructure Layer**: Data access, external services
- **API Layer**: Controllers, middleware, configuration

## 🔐 Security Features

- **JWT Bearer Authentication**
- **Role-Based Authorization** (Administrator, User)
- **Policy-Based Authorization** (CanManageProducts, CanPurge)
- **Rate Limiting** (100 requests/minute general, 5/minute for login)
- **Security Headers** (HSTS, CSP, X-Frame-Options, etc.)

## 📖 Documentation

- [Getting Started](./getting-started.md) - Setup and configuration
- [Authentication](./authentication.md) - How to authenticate
- [API Reference](./api/products.md) - Detailed endpoint documentation
- [Postman Collection](./guides/postman.md) - Testing with Postman

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📝 License

This project is licensed under the MIT License.
