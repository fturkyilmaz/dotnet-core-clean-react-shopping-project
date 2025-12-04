# Clean Architecture

## Nedir?

Clean Architecture, Robert C. Martin (Uncle Bob) tarafından popüler hale getirilen ve yazılım projelerini katmanlara ayıran bir mimari tasarım prensibidir. Temel amacı, endişelerin ayrılması (separation of concerns) ve bağımlılıkların yönetilmesidir. Bu mimarinin merkezinde, iş kurallarını (business logic) barındıran ve dış dünyadaki teknolojilerden (veritabanı, UI, framework'ler) bağımsız olan bir çekirdek (core) bulunur.

### Bağımlılık Kuralı (The Dependency Rule)

Clean Architecture'ın en önemli kuralı **bağımlılık kuralıdır**: *Kaynak kodu bağımlılıkları sadece içe doğru yönelebilir.* Yani, dış katmanlardaki bir şey, iç katmanlardaki bir şeyi bilebilir, ancak iç katmanlardaki bir şey, dış katmanlardaki bir şeyi bilemez. Örneğin, `Application` katmanı, `Domain` katmanını bilebilir, ancak `Domain` katmanı, `Application` katmanı hakkında hiçbir şey bilemez.

## Projenin Klasör Yapısı ve Katmanlar

Proje, Clean Architecture prensiplerine uygun olarak dört ana katmana ayrılmıştır. Bu katmanlar `src` klasörü altında bulunur:

```
src/
├── Domain/
├── Application/
├── Infrastructure/
└── Presentation/
```

### 1. `Domain` Katmanı

Bu katman, projenin kalbidir ve en iç katmandır. Diğer katmanlara bağımlılığı yoktur.

*   **Sorumlulukları:**
    *   **Entity'ler (Entities):** Uygulamanın temel nesnelerini temsil eder (Örn: `Product`, `Order`). Bu nesneler, kurumsal iş kurallarını içerir.
    *   **Aggregate'ler (Aggregates):** Birbiriyle ilişkili entity'leri bir araya getiren ve bir bütün olarak işlem görmesini sağlayan yapılardır.
    *   **Value Object'ler (Value Objects):** Kimliği olmayan, sadece değerleriyle anlam kazanan nesnelerdir (Örn: `Money`, `Address`).
    *   **Domain Olayları (Domain Events):** Domain içinde gerçekleşen önemli olayları temsil eder (Örn: `OrderCreatedEvent`).
    *   **Soyut Depo Arayüzleri (Abstract Repository Interfaces):** Veri erişim operasyonlarının kontratlarını tanımlar (Örn: `IProductRepository`). Bu arayüzlerin somut implementasyonları `Infrastructure` katmanında yer alır.

*   **Klasörler:**
    *   `Entities/`: Uygulamanın temel varlık sınıfları.
    *   `Events/`: Domain olayları.
    *   `Interfaces/` veya `Contracts/`: Depo (repository) ve diğer domain servislerinin arayüzleri.
    *   `ValueObjects/`: Değer nesneleri.

### 2. `Application` Katmanı

Bu katman, `Domain` katmanını çevreler ve uygulamanın kullanım senaryolarını (use cases) içerir. İş mantığını (business logic) yönetir.

*   **Sorumlulukları:**
    *   **CQRS (Command Query Responsibility Segregation):** MediatR kütüphanesi ile uygulanan komut (Command) ve sorguları (Query) içerir.
        *   **Commands:** Sistemin durumunu değiştiren operasyonlardır (Örn: `CreateProductCommand`).
        *   **Queries:** Sistemden veri okuyan operasyonlardır (Örn: `GetProductByIdQuery`).
    *   **DTO'lar (Data Transfer Objects):** `Presentation` katmanı ile veri alışverişi yapmak için kullanılan nesnelerdir.
    *   **Doğrulama (Validation):** Gelen komut ve sorguların doğruluğunu kontrol etmek için FluentValidation kurallarını içerir.
    *   **Soyut Arayüzler:** Dış dünya ile ilgili (e-posta gönderme, dosya sistemi vb.) servislerin arayüzlerini tanımlar.

*   **Klasörler:**
    *   `Features/`: Her bir domain varlığı için komutları ve sorguları gruplayan klasörler (Örn: `Features/Products/Commands/`).
    *   `DTOs/`: Veri transfer nesneleri.
    *   `Validators/`: FluentValidation sınıfları.
    *   `Interfaces/`: Dış servisler için arayüzler.

### 3. `Infrastructure` Katmanı

Bu katman, en dış katmanlardan biridir ve genellikle veritabanları, harici servisler, dosya sistemleri gibi dış dünya ile ilgili tüm teknik detayları içerir. `Application` ve `Domain` katmanlarında tanımlanan arayüzleri (interface) uygular.

*   **Sorumlulukları:**
    *   **Veri Erişimi (Data Access):** Entity Framework Core kullanarak `Domain` katmanında tanımlanan depo arayüzlerinin somut implementasyonlarını içerir (`ProductRepository`).
    *   **Harici Servis Entegrasyonları:** E-posta gönderme, ödeme sistemleri ile entegrasyon gibi dış servislerle iletişimi sağlar.
    *   **Mesajlaşma (Messaging):** RabbitMQ ve MassTransit ile mesaj yayınlama ve dinleme (consume) implementasyonlarını içerir.
    *   **Önbellekleme (Caching):** Redis gibi dağıtık önbellekleme mekanizmalarının implementasyonunu içerir.
    *   **Kimlik Doğrulama (Identity):** ASP.NET Core Identity ile kullanıcı yönetimi ve kimlik doğrulama işlemlerini içerir.

*   **Klasörler:**
    *   `Data/`: `DbContext` sınıfı, repository implementasyonları ve veritabanı migration'ları.
    *   `Services/`: E-posta servisi gibi harici servislerin somut sınıfları.
    *   `Bus/`: MassTransit ve RabbitMQ yapılandırması.
    *   `Identity/`: Kimlik doğrulama ile ilgili sınıflar.

### 4. `Presentation` Katmanı

Bu katman, kullanıcı ile etkileşime giren veya uygulamanın dış dünyaya açılan kapısıdır. Bu projede bir Web API'dir.

*   **Sorumlulukları:**
    *   **API Endpoint'leri:** `Controller`'lar aracılığıyla HTTP isteklerini kabul eder.
    *   **İstek ve Yanıt Yönetimi:** Gelen istekleri `Application` katmanındaki komutlara veya sorgulara yönlendirir ve dönen sonuçları HTTP yanıtlarına (JSON) dönüştürür.
    *   **Yapılandırma (Configuration):** Dependency Injection (DI) konteynerini, middleware pipeline'ını ve diğer başlangıç ayarlarını yapılandırır (`Program.cs`).
    *   **Hata Yönetimi (Error Handling):** Merkezi hata yakalama ve loglama mekanizmasını içerir.

*   **Klasörler:**
    *   `Controllers/`: API endpoint'lerini barındıran sınıflar.
    *   `Middleware/`: Özel middleware sınıfları (Örn: `CorrelationIdMiddleware`).
    *   `Extensions/`: Servis yapılandırmalarını organize eden extension metotları.

Bu yapı, projenin esnek, test edilebilir, bakımı kolay ve teknoloji bağımsızlıklarına sahip bir şekilde geliştirilmesini sağlar.
