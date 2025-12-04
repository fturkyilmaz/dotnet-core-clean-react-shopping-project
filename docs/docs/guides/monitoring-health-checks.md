# Monitoring: Health Checks, Health Checks UI

## Nedir?

**.NET Core Health Checks**, bir uygulamanın ve bağımlı olduğu altyapı bileşenlerinin (veritabanı, harici servisler, disk alanı vb.) durumunu ve sağlığını raporlamak için kullanılan bir mekanizmadır. Genellikle bir HTTP endpoint'i üzerinden uygulamanın "sağlıklı" (healthy) veya "sağlıksız" (unhealthy) olup olmadığını bildirir.

**Health Checks UI**, sağlık kontrolü sonuçlarını görüntülemek için zengin bir kullanıcı arayüzü sunan bir kütüphanedir. Birden fazla uygulamanın sağlık durumunu tek bir yerden izlemeyi ve geçmiş verileri görmeyi sağlar.

## Projede Neden Kullanılıyor?

*   **Proaktif Sorun Tespiti:** Uygulamanın veya bağımlılıklarının (PostgreSQL, Redis, RabbitMQ vb.) çalışıp çalışmadığını düzenli olarak kontrol ederek, olası sorunları kullanıcılar etkilenmeden önce tespit etmeyi sağlar.
*   **Otomatik Kurtarma (Automated Recovery):** Konteyner orkestrasyon araçları (Kubernetes, Docker Swarm) veya bulut servisleri, "sağlıksız" olarak işaretlenen bir uygulama örneğini otomatik olarak yeniden başlatarak sistemin kendi kendini onarmasına yardımcı olabilir.
*   **Merkezi İzleme:** Health Checks UI, projenin tüm kritik bağımlılıklarının durumunu tek bir dashboard üzerinden izlemeyi kolaylaştırır. Bu, sistemin genel sağlığı hakkında hızlı bir şekilde bilgi sahibi olmayı sağlar.
*   **Güvenilir Dağıtım (Reliable Deployments):** "Canlılık" (liveness) ve "hazırlık" (readiness) probları gibi konseptlerle entegre edilerek, bir uygulama örneği tamamen hazır olmadan kendisine trafik yönlendirilmesini engeller.

## Projedeki Yapılandırma

Health Checks, projenin `API` katmanında yapılandırılmıştır ve kritik altyapı bileşenlerinin sağlığını kontrol eder.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Health Checks ve UI için gerekli paketler `ShoppingProject.WebApi.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="AspNetCore.HealthChecks.UI" />
    <PackageReference Include="AspNetCore.HealthChecks.UI.Client" />
    <PackageReference Include="AspNetCore.HealthChecks.UI.InMemory.Storage" />
    <PackageReference Include="AspNetCore.HealthChecks.NpgSql" />
    <PackageReference Include="AspNetCore.HealthChecks.Redis" />
    <PackageReference Include="AspNetCore.HealthChecks.RabbitMQ" />
    <PackageReference Include="AspNetCore.HealthChecks.Uris" />
    ```

2.  **Sağlık Kontrollerinin Eklenmesi (`Program.cs`):** `AddHealthChecks` metodu ile sağlık kontrolü servisi eklenir ve projenin bağımlı olduğu her servis için bir kontrol yapılandırması yapılır.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddHealthChecks()
        .AddNpgSql(
            builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.DefaultConnection
            )!
        )
        .AddRedis(
            builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.RedisConnection
            )!
        )
        .AddRabbitMQ(
            builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.RabbitMqConnection
            )!,
            name: "rabbitmq",
            tags: new[] { "ready" }
        )
        .AddUrlGroup(
            new Uri(AppConstants.Observability.DefaultElasticsearchUrl),
            name: AppConstants.HealthCheckNames.Elasticsearch,
            tags: new[] { AppConstants.HealthCheckNames.Elasticsearch }
        );
    ```
    *   `AddNpgSql`: PostgreSQL veritabanının erişilebilir olup olmadığını kontrol eder.
    *   `AddRedis`: Redis sunucusunun erişilebilir olup olmadığını kontrol eder.
    *   `AddRabbitMQ`: RabbitMQ sunucusunun erişilebilir olup olmadığını kontrol eder.
    *   `AddUrlGroup`: Elasticsearch gibi harici bir URL'nin erişilebilir olup olmadığını kontrol eder.

3.  **Health Checks UI'ın Yapılandırılması:** Health Checks UI servisi ve verileri bellekte saklayacağı (`InMemoryStorage`) yapılandırma `Program.cs` dosyasına eklenir.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddHealthChecksUI().AddInMemoryStorage();
    ```

4.  **Endpoint'lerin Tanımlanması:** Sağlık durumu bilgilerini sunacak olan HTTP endpoint'leri ve Health Checks UI arayüzünün yolu `Program.cs` dosyasında `MapHealthChecks` ve `MapHealthChecksUI` metodları ile tanımlanır.

    ```csharp
    // src/Presentation/API/Program.cs
    app.MapHealthChecks("/health/ready",
        new HealthCheckOptions
        {
            Predicate = _ => true, // Tüm kontrolleri dahil et
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
        }
    );

    app.MapHealthChecksUI(options => options.UIPath = "/healthchecks-ui");
    ```
    *   `/health/ready`: Uygulamanın ve tüm bağımlılıklarının sağlıklı olup olmadığını JSON formatında raporlayan endpoint.
    *   `/healthchecks-ui`: Health Checks UI arayüzüne erişim sağlayan endpoint.

Bu yapılandırma sayesinde, uygulamanın ve kritik bağımlılıklarının sağlık durumu kolayca izlenebilir ve olası sorunlara karşı hızlı bir şekilde aksiyon alınabilir.
