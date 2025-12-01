# Docker Usage Guide

## Quick Start

### Build and Run with Docker Compose
```bash
# Start all services (API + Infrastructure)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Build Docker Image Only
```bash
# Build the API image
docker build -t shopping-api:latest .

# Run the image (requires external services)
docker run -p 5000:8080 \
  -e ConnectionStrings__DefaultConnection="Host=localhost;Database=ShoppingDb;Username=postgres;Password=postgres" \
  shopping-api:latest
```

## Services

After running `docker-compose up -d`, the following services will be available:

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | http://localhost:5000 | - |
| **Swagger** | http://localhost:5000/swagger | - |
| **Health Check** | http://localhost:5000/health | - |
| **PostgreSQL** | localhost:5432 | postgres/postgres |
| **Redis** | localhost:6379 | - |
| **RabbitMQ** | http://localhost:15672 | guest/guest |
| **Elasticsearch** | http://localhost:9200 | - |
| **Kibana** | http://localhost:5601 | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin/admin |
| **Jaeger** | http://localhost:16686 | - |
| **Consul** | http://localhost:8500 | - |
| **Hangfire** | http://localhost:5000/hangfire | - |

## Multi-Stage Build Explanation

The Dockerfile uses a 3-stage build process:

1. **Build Stage**: Restores NuGet packages and compiles the application
2. **Publish Stage**: Creates optimized release build
3. **Runtime Stage**: Minimal runtime image with only published artifacts

**Benefits**:
- Smaller final image (~200MB vs ~1GB)
- Faster deployment
- Better security (no build tools in production)

## Security Features

- ✅ Non-root user (`appuser`)
- ✅ Multi-stage build (no build tools in final image)
- ✅ Minimal base image (aspnet vs sdk)
- ✅ Health checks for all services
- ✅ Secrets via environment variables (use Docker secrets in production)

## Production Considerations

### Environment Variables
For production, use:
- Azure Key Vault
- Docker Secrets
- Kubernetes ConfigMaps/Secrets

### Image Registry
```bash
# Tag for registry
docker tag shopping-api:latest ghcr.io/your-org/shopping-api:v1.0.0

# Push to GitHub Container Registry
docker push ghcr.io/your-org/shopping-api:v1.0.0
```

### Resource Limits
Add to docker-compose.yml:
```yaml
api:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
```

## Troubleshooting

### API won't start
```bash
# Check logs
docker-compose logs api

# Check if database is ready
docker-compose exec postgres pg_isready -U postgres

# Restart API
docker-compose restart api
```

### Database connection issues
```bash
# Verify connection string
docker-compose exec api env | grep ConnectionStrings

# Test database connectivity
docker-compose exec api ping postgres
```

### Clean rebuild
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Development Workflow

```bash
# 1. Make code changes
# 2. Rebuild and restart
docker-compose up -d --build api

# 3. Watch logs
docker-compose logs -f api

# 4. Run migrations (if needed)
docker-compose exec api dotnet ef database update
```
