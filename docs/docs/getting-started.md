---
sidebar_position: 2
---

# Getting Started

This guide will help you set up and run the Shopping Project API locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 10 SDK** or later
- **Docker** and **Docker Compose**
- **PostgreSQL** 15+ (or use Docker)
- **Redis** (or use Docker)
- **RabbitMQ** (or use Docker)
- **Node.js** 18+ (for the React frontend)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ShoppingProject.git
cd ShoppingProject
```

### 2. Start Infrastructure Services

Use Docker Compose to start PostgreSQL, Redis, RabbitMQ, and Elasticsearch:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **RabbitMQ** on port 5672 (Management UI on 15672)
- **Elasticsearch** on port 9200
- **Kibana** on port 5601

### 3. Configure the API

Update `appsettings.json` if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=ShoppingProjectDb;Username=postgres;Password=postgres",
    "RedisConnection": "localhost:6379,abortConnect=false"
  },
  "JwtSettings": {
    "Secret": "YourSuperSecretKeyHere_MustBeAtLeast32CharactersLong",
    "Issuer": "ShoppingProject",
    "Audience": "ShoppingProject",
    "ExpiryMinutes": 60
  }
}
```

### 4. Run Database Migrations

```bash
cd src/API
dotnet ef database update
```

### 5. Run the API

```bash
dotnet run --project src/API/ShoppingProject.WebApi.csproj
```

The API will be available at `http://localhost:5000`.

### 6. Run the React Frontend (Optional)

```bash
cd src/Web/ClientApp
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Verify Installation

### Check API Health

Visit `http://localhost:5000/health` to see the health status of all services.

### Access Swagger UI

Visit `http://localhost:5000/swagger` to explore the API interactively.

### Access Hangfire Dashboard

Visit `http://localhost:5000/hangfire` to monitor background jobs.

## Next Steps

- [Learn about Authentication](./authentication.md)
- [Explore the API](./api/products.md)
- [Use Postman Collection](./guides/postman.md)

## Troubleshooting

### Database Connection Issues

If you can't connect to PostgreSQL:
1. Ensure Docker containers are running: `docker ps`
2. Check connection string in `appsettings.json`
3. Verify PostgreSQL is accepting connections: `docker logs postgres`

### Redis Connection Issues

If Redis is not working:
1. Check if Redis container is running
2. Test connection: `docker exec -it redis redis-cli ping`

### Port Conflicts

If ports are already in use:
1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`

## Environment Variables

You can override settings using environment variables:

```bash
export ConnectionStrings__DefaultConnection="your-connection-string"
export JwtSettings__Secret="your-secret-key"
```

## Development Tools

### Recommended VS Code Extensions

- C# Dev Kit
- REST Client
- Docker
- GitLens

### Recommended Tools

- **Postman** - API testing
- **pgAdmin** - PostgreSQL management
- **Redis Insight** - Redis management
- **RabbitMQ Management** - Queue monitoring
