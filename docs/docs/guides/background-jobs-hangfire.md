# Background Jobs: Hangfire

## Nedir?

**Hangfire**, .NET ve .NET Core uygulamaları için geliştirilmiş, açık kaynaklı, arka plan görevleri (background jobs) oluşturmayı ve yönetmeyi sağlayan bir kütüphanedir. "Ateşle ve unut" (fire-and-forget), gecikmeli (delayed), periyodik (recurring) ve sıralı (continuations) gibi farklı türde görevleri kolayca oluşturmanıza olanak tanır.

Oluşturulan görevler kalıcı bir depolama alanında (SQL Server, PostgreSQL, Redis vb.) saklanır, bu da uygulama yeniden başlasa bile görevlerin güvenilir bir şekilde çalıştırılmasını sağlar.

## Projede Neden Kullanılıyor?

*   **Kullanıcı Deneyimini İyileştirme:** E-posta gönderme, rapor oluşturma, veri senkronizasyonu gibi uzun süren işlemleri arka plana taşıyarak, kullanıcının anında yanıt almasını ve beklememesini sağlar.
*   **Güvenilirlik:** Hangfire, başarısız olan görevleri otomatik olarak yeniden deneme mekanizmasına sahiptir. Bu, geçici ağ sorunları veya diğer hatalara karşı sistemin dayanıklılığını artırır.
*   **Zamanlanmış Görevler:** Belirli bir zamanda veya düzenli aralıklarla çalışması gereken görevleri (örneğin, her gece yarısı veritabanı temizliği yapma) kolayca planlamayı sağlar.
*   **İzleme Arayüzü (Dashboard):** Hangfire, çalışan, tamamlanan, başarısız olan tüm görevleri izleyebileceğiniz ve yönetebileceğiniz bir web arayüzü sunar. Bu, geliştirme ve hata ayıklama süreçlerini büyük ölçüde kolaylaştırır.
*   **Kalıcılık (Persistence):** Görevler veritabanında saklandığı için, uygulama sunucusu çökse veya yeniden başlatılsa bile görevler kaybolmaz ve sunucu tekrar çalıştığında kaldığı yerden devam eder.

## Projedeki Yapılandırma

Hangfire, projenin `API` katmanında yapılandırılmıştır ve görevlerin depolanması için PostgreSQL veritabanını kullanır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Hangfire ve PostgreSQL entegrasyonu için gerekli paketler `ShoppingProject.WebApi.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="Hangfire.Core" />
    <PackageReference Include="Hangfire.AspNetCore" />
    <PackageReference Include="Hangfire.PostgreSql" />
    ```

2.  **Yapılandırma Dosyası (`appsettings.json`):** Hangfire için bağlantı dizesi ve çalışan (worker) sayısı gibi ayarlar `appsettings.json` dosyasında tanımlanmıştır.

    ```json
    // src/Presentation/API/appsettings.json
    "HangfireOptions": {
      "ConnectionString": "Server=localhost;Port=5432;Database=HangfireDb;User Id=admin;Password=password;",
      "WorkerCount": 5
    }
    ```

3.  **Servislerin Kaydedilmesi (`Program.cs`):** Hangfire servisleri `Program.cs` dosyasında yapılandırılır.
    *   `AddHangfire`: Hangfire'ı servislere ekler ve depolama olarak PostgreSQL'in kullanılacağını belirtir.
    *   `AddHangfireServer`: Arka planda görevleri çalıştıracak olan sunucuyu başlatır.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddHangfire(configuration =>
        configuration.UsePostgreSqlStorage(options =>
        {
            var hangfireOptions =
                builder.Configuration.GetSection(HangfireOptions.SectionName).Get<HangfireOptions>()
                ?? throw new InvalidOperationException("Hangfire options not configured");
            options.UseNpgsqlConnection(hangfireOptions.ConnectionString);
        })
    );

    builder.Services.AddHangfireServer(options =>
    {
        var hangfireOptions =
            builder.Configuration.GetSection(HangfireOptions.SectionName).Get<HangfireOptions>()
            ?? throw new InvalidOperationException("Hangfire options not configured");
        options.WorkerCount = hangfireOptions.WorkerCount;
    });
    ```

4.  **Dashboard'un Etkinleştirilmesi:** Hangfire Dashboard, sadece **geliştirme (Development)** ortamında aktif olacak şekilde `Program.cs` dosyasında yapılandırılmıştır. Bu arayüze `/hangfire` adresi üzerinden erişilebilir.

    ```csharp
    // src/Presentation/API/Program.cs
    if (app.Environment.IsDevelopment())
    {
        app.UseHangfireDashboard(
            builder.Configuration.GetValue<string>(
                ConfigurationConstants.Hangfire.DashboardPath,
                AppConstants.Endpoints.HangfireDashboard
            )
        );
    }
    ```

5.  **Görev Oluşturma ve Tetikleme:** Arka plan görevleri, `IBackgroundJobClient` arayüzü kullanılarak oluşturulur. Bu arayüz, dependency injection ile ihtiyaç duyulan servislere enjekte edilebilir.

    ```csharp
    // Örnek bir servis içinde kullanım
    public class MyService
    {
        private readonly IBackgroundJobClient _backgroundJobClient;

        public MyService(IBackgroundJobClient backgroundJobClient)
        {
            _backgroundJobClient = backgroundJobClient;
        }

        public void DoSomething()
        {
            // "Fire-and-forget" bir görev oluşturma
            _backgroundJobClient.Enqueue<IEmailService>(emailService => 
                emailService.SendWelcomeEmail("user@example.com"));
        }
    }
    ```
    Bu örnekte, `SendWelcomeEmail` metodu arka planda çalıştırılmak üzere bir kuyruğa eklenir ve metodu çağıran kod beklemeden yoluna devam eder.

Bu yapı, uygulamanın uzun süren işlemleri verimli ve güvenilir bir şekilde yönetmesini sağlar.
