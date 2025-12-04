# Messaging: RabbitMQ (MassTransit)

## Nedir?

**RabbitMQ**, açık kaynaklı, popüler bir mesajlaşma aracısıdır (message broker). Uygulamalar ve servisler arasında asenkron iletişimi sağlamak için kullanılır. Mesaj kuyrukları (message queues) oluşturarak, gönderici uygulamanın, alıcı uygulamanın anında müsait olmasını beklemeden mesaj göndermesine olanak tanır.

**MassTransit**, .NET için geliştirilmiş, açık kaynaklı ve ücretsiz bir framework'tür. RabbitMQ, Azure Service Bus gibi mesajlaşma sistemleri üzerinde çalışarak karmaşıklığı soyutlar ve geliştiricilerin mesaj tabanlı, dağıtık uygulamalar oluşturmasını kolaylaştırır.

## Projede Neden Kullanılıyor?

*   **Asenkron Operasyonlar:** Uzun süren veya anında sonuçlanması gerekmeyen işlemleri (örneğin, e-posta gönderme, rapor oluşturma, stok güncelleme) arka plana taşıyarak ana uygulama akışını yavaşlatmaz. Bu, kullanıcıya daha hızlı yanıt verilmesini sağlar.
*   **Servisler Arası İletişim (Decoupling):** Servislerin birbirine doğrudan bağımlı olmadan iletişim kurmasını sağlar. Bir servis, bir olayı (event) bir mesaj olarak yayınlar ve ilgili diğer servisler bu mesajı dinleyerek gerekli işlemleri yapar. Bu, sistemin daha esnek ve bakımı kolay olmasını sağlar.
*   **Güvenilirlik ve Dayanıklılık (Reliability & Resilience):** Bir servis geçici olarak çalışmıyorsa, gönderilen mesajlar RabbitMQ kuyruğunda bekletilir. Servis tekrar çalıştığında mesajları işleyebilir. Bu, sistemin hatalara karşı daha dayanıklı olmasını sağlar.
*   **Yük Dengeleme (Load Balancing):** Bir mesajı dinleyen birden fazla servis örneği (consumer) varsa, RabbitMQ mesajları bu örneklere dağıtarak iş yükünü dengeler.

## Projedeki Yapılandırma

Projede RabbitMQ ve MassTransit entegrasyonu `Infrastructure` katmanında ve `API` projesinin başlangıç yapılandırmasında yer alır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** MassTransit ve RabbitMQ entegrasyonu için gerekli paketler, `ShoppingProject.WebApi.csproj` ve `ShoppingProject.Infrastructure.csproj` dosyalarına eklenmiştir.

    ```xml
    <!-- ShoppingProject.WebApi.csproj -->
    <PackageReference Include="MassTransit.RabbitMQ" />
    
    <!-- ShoppingProject.Infrastructure.csproj -->
    <PackageReference Include="MassTransit" />
    ```

2.  **Bağlantı Bilgileri:** RabbitMQ sunucusunun bağlantı bilgileri, `appsettings.json` dosyasında saklanır.

    ```json
    // src/Presentation/API/appsettings.json
    "RabbitMqOptions": {
      "Host": "localhost",
      "Username": "guest",
      "Password": "guest"
    },
    "ConnectionStrings": {
      "RabbitMqConnection": "amqp://guest:guest@localhost:5672"
    }
    ```

3.  **MassTransit Servisinin Kaydedilmesi:** MassTransit, `src/Infrastructure/Bus/DependencyInjection.cs` dosyasında özel bir extension metodu (`AddBusExt`) ile yapılandırılır.

    ```csharp
    // src/Infrastructure/Bus/DependencyInjection.cs
    public static class DependencyInjection
    {
        public static void AddBusExt(this IServiceCollection services, IConfiguration configuration)
        {
            var rabbitMqOptions = configuration
                .GetSection(RabbitMqOptions.SectionName)
                .Get<RabbitMqOptions>();

            services.AddMassTransit(x =>
            {
                x.AddConsumersFromNamespaceContaining<ProductCreatedEventConsumer>();

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(rabbitMqOptions.Host, "/", h =>
                    {
                        h.Username(rabbitMqOptions.Username);
                        h.Password(rabbitMqOptions.Password);
                    });
                    
                    cfg.ConfigureEndpoints(context);
                });
            });
        }
    }
    ```
    *   `AddConsumersFromNamespaceContaining`: Belirtilen namespace içerisindeki tüm "consumer" (mesaj dinleyici) sınıflarını otomatik olarak tarar ve kaydeder.
    *   `UsingRabbitMq`: MassTransit'in RabbitMQ'yu kullanacağını ve bağlantı ayarlarını belirtir.

4.  **Olay (Event) ve Dinleyici (Consumer) Örneği:**
    *   **Olay (Event):** Sistemde gerçekleşen bir durumu temsil eden bir mesajdır. Örneğin, `ProductCreatedEvent`.
        ```csharp
        // src/Domain/Events/ProductCreatedEvent.cs
        public record ProductCreatedEvent(int ProductId, string ProductName);
        ```
    *   **Dinleyici (Consumer):** Belirli bir türdeki olayı dinleyen ve işleyen sınıftır.
        ```csharp
        // src/Infrastructure/EventHandlers/ProductCreatedEventConsumer.cs
        public class ProductCreatedEventConsumer : IConsumer<ProductCreatedEvent>
        {
            private readonly ILogger<ProductCreatedEventConsumer> _logger;

            public ProductCreatedEventConsumer(ILogger<ProductCreatedEventConsumer> logger)
            {
                _logger = logger;
            }

            public Task Consume(ConsumeContext<ProductCreatedEvent> context)
            {
                _logger.LogInformation("New product created: {ProductName} (ID: {ProductId})", 
                    context.Message.ProductName, context.Message.ProductId);
                
                // Burada e-posta gönderme, stok güncelleme gibi işlemler yapılabilir.
                return Task.CompletedTask;
            }
        }
        ```

5.  **Mesaj Yayınlama (Publishing):** Bir olay, `IPublishEndpoint` arayüzü kullanılarak yayınlanır. Bu arayüz, genellikle MediatR işleyicileri veya servisler içerisine enjekte edilir.

    ```csharp
    // src/Application/Features/Products/Commands/CreateProductCommandHandler.cs
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPublishEndpoint _publishEndpoint;

        public CreateProductCommandHandler(IApplicationDbContext context, IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _publishEndpoint = publishEndpoint;
        }

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // ... ürün oluşturma mantığı ...

            await _context.SaveChangesAsync(cancellationToken);

            // Ürün oluşturulduktan sonra olayı yayınla
            await _publishEndpoint.Publish(new ProductCreatedEvent(product.Id, product.Name), cancellationToken);

            return product.Id;
        }
    }
    ```

Bu yapı, sistemin esnek, ölçeklenebilir ve dayanıklı bir şekilde asenkron iletişim kurmasını sağlar.
