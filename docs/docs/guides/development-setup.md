---
sidebar_position: 1
---

# Geliştirme Ortamı Kurulumu

Bu kılavuz, ShoppingProject'i yerel geliştirme ortamınızda çalıştırmak için gereken adımları açıklar.

## Gereksinimler

### Zorunlu Bileşenler

- **.NET 10 SDK** - [İndir](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 18+** - [İndir](https://nodejs.org/)
- **Docker Desktop** - [İndir](https://www.docker.com/products/docker-desktop)
- **Git** - [İndir](https://git-scm.com/)

### Önerilen Araçlar

- **Visual Studio 2022** veya **JetBrains Rider** (Backend geliştirme için)
- **Visual Studio Code** (Frontend geliştirme için)
- **Postman** veya **Insomnia** (API testleri için)
- **Azure Data Studio** veya **pgAdmin** (PostgreSQL yönetimi için)

## Kurulum Adımları

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/dotnet-core-clean-react-shopping-project.git
cd dotnet-core-clean-react-shopping-project
```

### 2. Altyapı Servislerini Başlatın

Docker Compose ile gerekli servisleri başlatın:

```bash
docker-compose up -d
```

Bu komut şu servisleri başlatır:
- **PostgreSQL** (Port: 5432)
- **Redis** (Port: 6379)
- **RabbitMQ** (Port: 5672, Management UI: 15672)
- **Elasticsearch** (Port: 9200)
- **Kibana** (Port: 5601)
- **Consul** (Port: 8500)

### 3. Veritabanı Migrasyonlarını Uygulayın

```bash
cd src/Presentation/API
dotnet ef database update
```

### 4. Backend API'yi Başlatın

```bash
cd src/Presentation/API
dotnet run
```

API şu adreste çalışacak: `https://localhost:7001`

**Swagger UI:** `https://localhost:7001/swagger`

### 5. Frontend Uygulamasını Başlatın

Yeni bir terminal açın:

```bash
cd src/Presentation/ClientApp
npm install
npm start
```

React uygulaması şu adreste çalışacak: `http://localhost:3000`

### 6. Mobile App'i Başlatın (Opsiyonel)

```bash
cd src/Presentation/MobileApp
npm install
npx expo start
```

## Ortam Değişkenleri

### Backend (appsettings.Development.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=ShoppingDb;Username=postgres;Password=postgres",
    "RedisConnection": "localhost:6379"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-min-32-characters-long",
    "Issuer": "ShoppingProject",
    "Audience": "ShoppingProjectUsers",
    "ExpiryMinutes": 60
  }
}
```

### Frontend (.env.development)

```env
REACT_APP_API_URL=https://localhost:7001
REACT_APP_SIGNALR_HUB_URL=https://localhost:7001
```

## Varsayılan Kullanıcılar

Veritabanı seed işlemi sonrası kullanılabilir hesaplar:

### Admin Hesabı
- **Email:** admin@shoppingproject.com
- **Password:** Admin@123

### Test Kullanıcısı
- **Email:** user@shoppingproject.com
- **Password:** User@123

## Geliştirme Araçları

### Hot Reload

Backend ve frontend otomatik yeniden yükleme destekler:

**Backend:**
```bash
dotnet watch run
```

**Frontend:**
```bash
npm start
```

### Code Formatting

**Backend (.NET):**
```bash
dotnet format
```

**Frontend (Prettier):**
```bash
npm run format
```

### Linting

**Backend:**
```bash
dotnet build /warnaserror
```

**Frontend:**
```bash
npm run lint
```

## Test Çalıştırma

### Unit Tests

```bash
cd src/UnitTests
dotnet test
```

### Integration Tests (Gelecekte eklenecek)

```bash
cd tests/IntegrationTests
dotnet test
```

### Frontend Tests

```bash
cd src/Presentation/ClientApp
npm test
```

## Sorun Giderme

### Port Çakışması

Eğer portlar kullanımdaysa, `docker-compose.yml` ve `appsettings.json` dosyalarında port numaralarını değiştirin.

### Veritabanı Bağlantı Hatası

1. Docker container'ların çalıştığından emin olun:
   ```bash
   docker ps
   ```

2. PostgreSQL loglarını kontrol edin:
   ```bash
   docker logs shopping-postgres
   ```

### Migration Hataları

Tüm migrationları sıfırlayıp yeniden oluşturun:

```bash
dotnet ef database drop -f
dotnet ef database update
```

### Redis Bağlantı Hatası

Redis container'ını yeniden başlatın:

```bash
docker restart shopping-redis
```

## Faydalı Komutlar

### Tüm Servisleri Durdur

```bash
docker-compose down
```

### Veritabanını Temizle

```bash
docker-compose down -v
```

### Logları Görüntüle

```bash
# Tüm servisler
docker-compose logs -f

# Belirli bir servis
docker-compose logs -f postgres
```

### Yeni Migration Oluştur

```bash
cd src/Presentation/API
dotnet ef migrations add MigrationName
```

## IDE Yapılandırması

### Visual Studio 2022

1. `ShoppingProject.sln` dosyasını açın
2. Startup Project olarak `ShoppingProject.WebApi` seçin
3. F5 ile debug modunda başlatın

### VS Code

1. Proje klasörünü açın
2. Önerilen extension'ları yükleyin
3. F5 ile debug modunda başlatın (launch.json hazır)

### JetBrains Rider

1. `ShoppingProject.sln` dosyasını açın
2. Run Configuration'ı seçin
3. Shift+F10 ile çalıştırın

## Sonraki Adımlar

- [API Referansı](/docs/api-reference)
- [Mimari Dokümantasyonu](/docs/architecture)
- [Docker Deployment](/docs/guides/docker-deployment)
- [Clean Architecture Refactoring](/docs/guides/clean-architecture-refactoring)
