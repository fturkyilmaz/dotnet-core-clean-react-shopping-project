# Logging & Observability: ELK Stack (Elasticsearch, Logstash, Kibana), Serilog

## Nedir?

**Serilog**, .NET uygulamaları için geliştirilmiş, yapısal loglama (structured logging) kütüphanesidir. Geleneksel metin tabanlı loglamanın aksine, log mesajlarını ve verilerini (örneğin, JSON formatında) zengin, yapısal bir formatta kaydeder. Bu, logların daha kolay sorgulanmasını, filtrelenmesini ve analiz edilmesini sağlar.

**ELK Stack**, üç açık kaynaklı projenin birleşiminden oluşan bir log yönetimi platformudur:
*   **Elasticsearch:** Logları ve diğer verileri depolamak, aramak ve analiz etmek için kullanılan bir arama ve analiz motorudur.
*   **Logstash:** Farklı kaynaklardan gelen verileri toplayan, işleyen ve Elasticsearch gibi hedeflere gönderen bir veri işleme hattıdır. (Bu projede Serilog, Logstash'in görevini üstlenerek logları doğrudan Elasticsearch'e gönderir.)
*   **Kibana:** Elasticsearch'te depolanan verileri görselleştirmek, keşfetmek ve analiz etmek için kullanılan bir web arayüzüdür. Grafikler, tablolar ve haritalar oluşturmanıza olanak tanır.

## Projede Neden Kullanılıyor?

*   **Merkezi Log Yönetimi:** Farklı servislerden ve uygulama örneklerinden gelen tüm logları tek bir merkezi konumda (Elasticsearch) toplar. Bu, özellikle dağıtık mimarilerde hata ayıklamayı ve sistemin genel durumunu izlemeyi basitleştirir.
*   **Yapısal Loglamanın Gücü:** Serilog ile kaydedilen yapısal loglar, Elasticsearch'te kolayca indekslenir ve sorgulanabilir. Örneğin, "belirli bir kullanıcı ID'sine ait tüm hata loglarını getir" gibi karmaşık sorgular kolayca yapılabilir.
*   **Gelişmiş Analiz ve Görselleştirme:** Kibana, log verileri üzerinden metrikler oluşturmayı, trendleri analiz etmeyi ve olası sorunları proaktif olarak tespit etmeyi sağlayan güçlü görselleştirme araçları sunar.
*   **Hata Ayıklama ve Sorun Giderme:** Bir hata oluştuğunda, ilgili isteğin tüm yaşam döngüsü boyunca (örneğin, bir `CorrelationId` ile) bıraktığı logları filtreleyerek sorunun temel nedenini bulmak çok daha hızlı ve verimli hale gelir.

## Projedeki Yapılandırma

Serilog, logları hem konsola, hem bir dosyaya hem de Elasticsearch'e gönderecek şekilde yapılandırılmıştır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Serilog ve ilgili "sink" (logların yazılacağı hedef) paketleri `ShoppingProject.WebApi.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="Serilog.AspNetCore" />
    <PackageReference Include="Serilog.Sinks.Console" />
    <PackageReference Include="Serilog.Sinks.File" />
    <PackageReference Include="Serilog.Sinks.Elasticsearch" />
    ```

2.  **Yapılandırma Dosyası (`appsettings.json`):** Serilog'un davranışı ve sink ayarları `appsettings.json` dosyasında merkezi olarak yönetilir. Bu, kod değişikliği yapmadan loglama seviyelerini veya hedeflerini değiştirmeyi mümkün kılar.

    ```json
    // src/Presentation/API/appsettings.json
    "Serilog": {
      "MinimumLevel": {
        "Default": "Information",
        "Override": {
          "Microsoft": "Warning",
          "System": "Warning"
        }
      },
      "WriteTo": [
        { "Name": "Console" },
        {
          "Name": "File",
          "Args": {
            "path": "logs/log-.txt",
            "rollingInterval": "Day"
          }
        },
        {
          "Name": "Elasticsearch",
          "Args": {
            "nodeUris": "http://localhost:9200",
            "indexFormat": "shopping-project-logs-{0:yyyy.MM.dd}",
            "autoRegisterTemplate": true
          }
        }
      ],
      "Enrich": [ "FromLogContext", "WithMachineName", "WithThreadId" ],
      "Properties": {
        "Application": "ShoppingProject.WebApi"
      }
    }
    ```
    *   `WriteTo`: Logların nereye yazılacağını tanımlar (Console, File, Elasticsearch).
    *   `Enrich`: Log mesajlarını makine adı, thread ID gibi ek bilgilerle zenginleştirir.

3.  **Serilog'un Entegre Edilmesi (`Program.cs`):** Serilog, `Program.cs` dosyasında .NET'in kendi loglama sistemini devralacak şekilde yapılandırılır.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Host.UseSerilog(
        (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration)
    );
    ```
    Bu satır, Serilog'a yapılandırmasını `appsettings.json` dosyasından okumasını söyler.

4.  **Kullanım:** Serilog entegrasyonu sayesinde, Microsoft'un standart `ILogger<T>` arayüzü kullanılarak loglama yapılır. Bu arayüz, dependency injection ile herhangi bir sınıfa enjekte edilebilir.

    ```csharp
    // Herhangi bir servis veya controller içerisinde
    public class MyService
    {
        private readonly ILogger<MyService> _logger;

        public MyService(ILogger<MyService> logger)
        {
            _logger = logger;
        }

        public void DoSomething(int customerId)
        {
            _logger.LogInformation("Starting operation for customer {CustomerId}", customerId);

            try
            {
                // ... işlem ...
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing for customer {CustomerId}", customerId);
            }
        }
    }
    ```
    Burada `{CustomerId}` gibi yapısal parametreler kullanılarak, bu değerlerin Elasticsearch'te ayrı bir alan olarak indekslenmesi ve sorgulanabilir olması sağlanır.
