# Caching: Redis (Distributed Cache)

## Nedir?

**Redis**, açık kaynaklı, yüksek performanslı, bellek-içi (in-memory) bir veri yapısı deposudur. Genellikle veritabanı, önbellek (cache) ve mesajlaşma aracısı (message broker) olarak kullanılır. Verileri ana bellekte saklaması sayesinde çok hızlı okuma ve yazma işlemleri sunar.

**Distributed Cache (Dağıtık Önbellek)**, birden fazla sunucu veya uygulama örneği tarafından paylaşılabilen bir önbellekleme mekanizmasıdır. Bu, uygulamanın ölçeklendiği durumlarda (örneğin, birden fazla web sunucusu arkasında çalıştığında) tutarlılığı sağlar.

## Projede Neden Kullanılıyor?

*   **Performans Artışı:** Sık erişilen ve nadiren değişen verileri (örneğin, ürün listesi, kategori bilgileri) Redis'te önbelleğe alarak veritabanı üzerindeki yükü azaltır ve uygulama yanıt sürelerini önemli ölçüde iyileştirir.
*   **Ölçeklenebilirlik:** Uygulama birden fazla sunucuya dağıtıldığında, tüm sunucuların aynı önbellek verisine erişmesini sağlar. Bu, veri tutarlılığını korur ve her sunucunun kendi yerel önbelleğini tutma ihtiyacını ortadan kaldırır.
*   **Veritabanı Yükünü Azaltma:** Veritabanına yapılan sorgu sayısını azaltarak veritabanı sunucusunun daha verimli çalışmasını sağlar ve maliyetleri düşürebilir.
*   **Kullanıcı Deneyimini İyileştirme:** Sayfaların daha hızlı yüklenmesi, kullanıcıların uygulamada daha akıcı bir deneyim yaşamasını sağlar.

## Projedeki Yapılandırma

Projede Redis, hem dağıtık önbellekleme hem de "rate limiting" (istek sınırlama) için kullanılmaktadır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Redis entegrasyonu için gerekli paketler, `ShoppingProject.WebApi.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" />
    <PackageReference Include="AspNetCore.HealthChecks.Redis" />
    ```

2.  **Bağlantı Dizesi (Connection String):** Redis sunucusunun bağlantı bilgileri, `appsettings.json` dosyasında saklanır.

    ```json
    // src/Presentation/API/appsettings.json
    "ConnectionStrings": {
      "RedisConnection": "localhost:6379"
    }
    ```

3.  **Redis Servisinin Kaydedilmesi:** Redis, `Program.cs` dosyasında dağıtık önbellek servisi olarak kaydedilir. Bu yapılandırma, sadece **üretim (Production)** ortamında aktif olacak şekilde ayarlanmıştır. Geliştirme ortamında ise bellek-içi önbellek (`InMemoryRateLimiting`) kullanılır.

    ```csharp
    // src/Presentation/API/Program.cs
    if (builder.Environment.IsProduction())
    {
        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.RedisConnection
            );
            options.InstanceName = "RateLimiting:"; // Önbellek anahtarları için bir önek
        });
        builder.Services.AddDistributedRateLimiting();
    }
    else
    {
        builder.Services.AddInMemoryRateLimiting();
    }
    ```

4.  **Health Check (Sağlık Kontrolü):** Sistemin genel sağlığını izlemek için Redis'e bir sağlık kontrolü eklenmiştir. Bu, Redis sunucusunun çalışıp çalışmadığını düzenli olarak kontrol eder.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddHealthChecks()
        .AddRedis(
            builder.Configuration.GetConnectionString(
                ConfigurationConstants.ConnectionStrings.RedisConnection
            )!
        );
    ```

5.  **Output Cache (Çıktı Önbellekleme) ile Kullanım:** .NET 10.0 ile gelen "Output Caching" özelliği, belirli endpoint'lerin çıktısını önbelleğe almak için kullanılır. Projede, ürün listesi ve ürün detayı gibi endpoint'ler için önbellekleme politikaları tanımlanmıştır.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddOutputCache(options =>
    {
        options.AddPolicy(
            AppConstants.CachePolicies.ProductsList,
            builder => builder.Expire(TimeSpan.FromMinutes(2)).Tag(AppConstants.CacheTags.Products)
        );
        options.AddPolicy(
            AppConstants.CachePolicies.ProductDetail,
            builder =>
                builder
                    .Expire(TimeSpan.FromMinutes(5))
                    .Tag(AppConstants.CacheTags.Products)
                    .SetVaryByQuery("id")
        );
    });
    ```

    Bu politikalar, ilgili `Controller` endpoint'lerinde `[OutputCache]` attribute'u ile kullanılır.

    ```csharp
    // src/Presentation/API/Controllers/ProductsController.cs
    [HttpGet]
    [OutputCache(PolicyName = AppConstants.CachePolicies.ProductsList)]
    public async Task<IActionResult> GetProducts()
    {
        // ...
    }
    ```

Bu yapılandırma, uygulamanın performansını ve ölçeklenebilirliğini artırmak için modern önbellekleme tekniklerinin etkin bir şekilde kullanılmasını sağlar.
