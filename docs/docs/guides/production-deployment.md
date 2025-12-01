---
sidebar_position: 2
---

# Production Deployment Kılavuzu

Bu kılavuz, ShoppingProject'i production ortamına deploy etmek için gereken adımları açıklar.

## Deployment Seçenekleri

1. **Azure App Service + Azure Cosmos DB** (Önerilen)
2. **Docker + Kubernetes**
3. **AWS ECS + RDS**
4. **On-Premise Server**

## Azure Deployment

### Gereksinimler

- Azure Subscription
- Azure CLI yüklü
- Docker Desktop (container build için)

### 1. Azure Kaynaklarını Oluşturun

```bash
# Azure'a login olun
az login

# Resource group oluşturun
az group create --name rg-shopping-prod --location eastus

# PostgreSQL Server oluşturun
az postgres flexible-server create \
  --resource-group rg-shopping-prod \
  --name shopping-db-prod \
  --location eastus \
  --admin-user adminuser \
  --admin-password "YourStrongPassword123!" \
  --sku-name Standard_B2s \
  --tier Burstable \
  --version 14

# Redis Cache oluşturun
az redis create \
  --resource-group rg-shopping-prod \
  --name shopping-cache-prod \
  --location eastus \
  --sku Basic \
  --vm-size c0

# Container Registry oluşturun
az acr create \
  --resource-group rg-shopping-prod \
  --name shoppingregistryprod \
  --sku Basic

# App Service Plan oluşturun
az appservice plan create \
  --name shopping-plan-prod \
  --resource-group rg-shopping-prod \
  --is-linux \
  --sku P1V2

# Web App oluşturun
az webapp create \
  --resource-group rg-shopping-prod \
  --plan shopping-plan-prod \
  --name shopping-api-prod \
  --deployment-container-image-name shoppingregistryprod.azurecr.io/shopping-api:latest
```

### 2. Application Settings'i Yapılandırın

```bash
az webapp config appsettings set \
  --resource-group rg-shopping-prod \
  --name shopping-api-prod \
  --settings \
    ConnectionStrings__DefaultConnection="Host=shopping-db-prod.postgres.database.azure.com;Database=ShoppingDb;Username=adminuser;Password=YourStrongPassword123!;SSL Mode=Require" \
    ConnectionStrings__RedisConnection="shopping-cache-prod.redis.cache.windows.net:6380,password=your-redis-key,ssl=True,abortConnect=False" \
    Jwt__Secret="your-production-secret-key-min-32-chars" \
    Jwt__Issuer="ShoppingProject" \
    Jwt__Audience="ShoppingProjectUsers" \
    ASPNETCORE_ENVIRONMENT="Production"
```

### 3. Docker Image Build ve Push

```bash
# ACR'ye login olun
az acr login --name shoppingregistryprod

# Docker image build edin
docker build -t shoppingregistryprod.azurecr.io/shopping-api:latest -f Dockerfile .

# Image'ı push edin
docker push shoppingregistryprod.azurecr.io/shopping-api:latest
```

### 4. Database Migration'ları Çalıştırın

```bash
# Connection string'i environment variable olarak set edin
export ConnectionStrings__DefaultConnection="Host=shopping-db-prod.postgres.database.azure.com;Database=ShoppingDb;Username=adminuser;Password=YourStrongPassword123!;SSL Mode=Require"

# Migration'ları çalıştırın
cd src/Presentation/API
dotnet ef database update
```

### 5. Frontend'i Azure Static Web Apps'e Deploy Edin

```bash
# Static Web App oluşturun
az staticwebapp create \
  --name shopping-web-prod \
  --resource-group rg-shopping-prod \
  --location eastus

# Frontend build edin
cd src/Presentation/ClientApp
npm run build

# Deploy edin (GitHub Actions ile otomatik yapılabilir)
```

## Kubernetes Deployment

### 1. Kubernetes Cluster Oluşturun

```bash
# AKS cluster oluşturun
az aks create \
  --resource-group rg-shopping-prod \
  --name shopping-aks-prod \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Kubectl credentials alın
az aks get-credentials \
  --resource-group rg-shopping-prod \
  --name shopping-aks-prod
```

### 2. Kubernetes Manifests Uygulayın

```bash
# Namespace oluşturun
kubectl create namespace shopping-prod

# Secrets oluşturun
kubectl create secret generic shopping-secrets \
  --from-literal=db-password=YourStrongPassword123! \
  --from-literal=jwt-secret=your-production-secret-key \
  --namespace shopping-prod

# ConfigMap oluşturun
kubectl apply -f k8s/configmap.yaml

# Deployments uygulayın
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/rabbitmq-deployment.yaml
kubectl apply -f k8s/api-deployment.yaml

# Services uygulayın
kubectl apply -f k8s/services.yaml

# Ingress uygulayın
kubectl apply -f k8s/ingress.yaml
```

### 3. SSL/TLS Sertifikası Yapılandırın

```bash
# cert-manager yükleyin
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Let's Encrypt ClusterIssuer oluşturun
kubectl apply -f k8s/cluster-issuer.yaml
```

## CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy-production.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '10.0.x'
    
    - name: Build and Test
      run: |
        dotnet restore
        dotnet build --configuration Release
        dotnet test --no-build --verbosity normal
    
    - name: Login to Azure Container Registry
      uses: azure/docker-login@v1
      with:
        login-server: ${{ secrets.ACR_LOGIN_SERVER }}
        username: ${{ secrets.ACR_USERNAME }}
        password: ${{ secrets.ACR_PASSWORD }}
    
    - name: Build and Push Docker Image
      run: |
        docker build -t ${{ secrets.ACR_LOGIN_SERVER }}/shopping-api:${{ github.sha }} .
        docker push ${{ secrets.ACR_LOGIN_SERVER }}/shopping-api:${{ github.sha }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: shopping-api-prod
        images: ${{ secrets.ACR_LOGIN_SERVER }}/shopping-api:${{ github.sha }}
```

## Production Checklist

### Güvenlik

- [ ] HTTPS/TLS sertifikası yapılandırıldı
- [ ] JWT secret güçlü ve güvenli
- [ ] Database şifreleri güçlü
- [ ] CORS ayarları production domain'leri içeriyor
- [ ] API rate limiting aktif
- [ ] Security headers yapılandırıldı
- [ ] Secrets Azure Key Vault'ta saklanıyor

### Performance

- [ ] Redis cache aktif
- [ ] Database connection pooling yapılandırıldı
- [ ] Response caching aktif
- [ ] CDN yapılandırıldı (frontend için)
- [ ] Image optimization yapıldı
- [ ] Gzip compression aktif
- [ ] Database indexler oluşturuldu

### Monitoring

- [ ] Application Insights yapılandırıldı
- [ ] Log aggregation aktif (Elasticsearch/Kibana)
- [ ] Health checks yapılandırıldı
- [ ] Alerting kuralları oluşturuldu
- [ ] Performance metrics izleniyor
- [ ] Error tracking aktif (Sentry/AppInsights)

### Backup & Recovery

- [ ] Database otomatik backup aktif
- [ ] Backup retention policy tanımlandı
- [ ] Disaster recovery planı hazır
- [ ] Database point-in-time recovery test edildi

### Scalability

- [ ] Auto-scaling yapılandırıldı
- [ ] Load balancer yapılandırıldı
- [ ] Database read replicas oluşturuldu (gerekirse)
- [ ] Redis cluster yapılandırıldı (gerekirse)

## Environment Variables (Production)

```bash
# Database
ConnectionStrings__DefaultConnection="Host=prod-db;Database=ShoppingDb;Username=admin;Password=***"
ConnectionStrings__RedisConnection="prod-redis:6380,password=***,ssl=True"

# JWT
Jwt__Secret="***" # Minimum 32 karakter
Jwt__Issuer="ShoppingProject"
Jwt__Audience="ShoppingProjectUsers"
Jwt__ExpiryMinutes="60"

# CORS
Cors__AllowedOrigins__0="https://shopping.yourdomain.com"

# Hangfire
Hangfire__ConnectionString="Host=prod-db;Database=HangfireDb;Username=admin;Password=***"
Hangfire__WorkerCount="5"

# RabbitMQ
ServiceBus__Url="amqp://user:password@prod-rabbitmq:5672"

# Application Insights
ApplicationInsights__InstrumentationKey="***"

# Environment
ASPNETCORE_ENVIRONMENT="Production"
```

## Rollback Stratejisi

### Azure App Service

```bash
# Önceki deployment'a geri dön
az webapp deployment slot swap \
  --resource-group rg-shopping-prod \
  --name shopping-api-prod \
  --slot staging \
  --target-slot production
```

### Kubernetes

```bash
# Önceki revision'a rollback
kubectl rollout undo deployment/shopping-api -n shopping-prod

# Belirli bir revision'a rollback
kubectl rollout undo deployment/shopping-api --to-revision=2 -n shopping-prod
```

## Monitoring & Logging

### Application Insights Queries

```kusto
// Error rate
requests
| where timestamp > ago(1h)
| summarize ErrorRate = countif(success == false) * 100.0 / count() by bin(timestamp, 5m)

// Slow requests
requests
| where timestamp > ago(1h)
| where duration > 1000
| project timestamp, name, duration, resultCode

// Dependency failures
dependencies
| where timestamp > ago(1h)
| where success == false
| summarize count() by type, target
```

### Health Check Endpoints

- **API Health:** `https://api.yourdomain.com/health`
- **Detailed Health:** `https://api.yourdomain.com/health-ui`

## Troubleshooting

### High CPU Usage

```bash
# Pod resource kullanımını kontrol edin
kubectl top pods -n shopping-prod

# Horizontal Pod Autoscaler ekleyin
kubectl autoscale deployment shopping-api --cpu-percent=70 --min=3 --max=10 -n shopping-prod
```

### Database Connection Issues

```bash
# Connection pool ayarlarını optimize edin
ConnectionStrings__DefaultConnection="...;Maximum Pool Size=100;Connection Lifetime=300"
```

### Memory Leaks

```bash
# Memory dump alın
kubectl exec -it <pod-name> -n shopping-prod -- dotnet-dump collect -p 1

# Dump'ı analiz edin
dotnet-dump analyze <dump-file>
```

## Support & Maintenance

- **On-call rotation:** PagerDuty/Opsgenie
- **Incident response:** Runbook hazır
- **Maintenance window:** Cumartesi 02:00-04:00 UTC
- **SLA Target:** 99.9% uptime

## Sonraki Adımlar

- [Monitoring & Observability](/docs/guides/monitoring)
- [Security Best Practices](/docs/guides/security)
- [Performance Optimization](/docs/guides/performance)
