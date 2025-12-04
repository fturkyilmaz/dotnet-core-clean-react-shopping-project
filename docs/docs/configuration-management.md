# Yapılandırma Yönetimi (Configuration Management)

## Nedir?

Yapılandırma yönetimi, bir uygulamanın davranışını kod değişikliği yapmadan değiştirebilen parametrelerin (yapılandırma değerleri) yönetilmesi sürecidir. Bu değerler arasında veritabanı bağlantı dizeleri, harici servis URL'leri, API anahtarları, loglama seviyeleri gibi bilgiler bulunur.

.NET Core, bu tür yapılandırma verilerini yönetmek için esnek ve güçlü bir sistem sunar. Proje, bu sistemin temel bileşenlerini etkin bir şekilde kullanmaktadır.

## Projedeki Yaklaşım

Projede yapılandırma yönetimi üç ana prensip üzerine kuruludur:

1.  **Merkezi Yapılandırma Dosyaları:** Yapılandırma değerleri, JSON formatındaki `appsettings.json` dosyalarında saklanır.
2.  **Options Pattern:** Yapılandırma verileri, güçlü bir şekilde tiplendirilmiş (strongly-typed) C# sınıflarına bağlanır.
3.  **Yapılandırma Doğrulaması:** Uygulama başlarken, gerekli yapılandırma değerlerinin mevcut ve geçerli olduğu doğrulanır.

---

### 1. `appsettings.json` Dosyaları

Yapılandırma değerleri, hiyerarşik bir yapıda `appsettings.json` dosyalarında tutulur. Bu, ayarları mantıksal gruplara ayırmayı kolaylaştırır.

*   `appsettings.json`: Tüm ortamlar için geçerli olan varsayılan ayarları içerir.
*   `appsettings.Development.json`: Sadece geliştirme (Development) ortamında çalışırken `appsettings.json`'daki değerleri ezen veya onlara ek yapan ayarları içerir.
*   `appsettings.Production.json`: Sadece üretim (Production) ortamında çalışırken geçerli olan ayarları içerir.

**Örnek `appsettings.json` Yapısı:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "...",
    "RedisConnection": "..."
  },
  "RabbitMqOptions": {
    "Host": "localhost",
    "Username": "guest",
    "Password": "guest"
  },
  "Serilog": {
    // ... Serilog ayarları
  }
}
```

---

### 2. Options Pattern

Yapılandırma verilerini doğrudan `IConfiguration` servisinden string olarak okumak yerine, **Options Pattern** kullanılarak bu veriler C# sınıflarına bağlanır. Bu yaklaşımın birçok avantajı vardır:

*   **Güçlü Tiplendirme (Strongly-Typed):** Yapılandırma değerlerine `options.Value.Host` gibi tiplendirilmiş özellikler üzerinden erişilir. Bu, yazım hatalarını ("Host" yerine "hostt" yazmak gibi) derleme zamanında önler.
*   **Sorumlulukların Ayrılması (SoC):** Bir yapılandırma bölümüyle ilgili tüm ayarlar, kendi sınıfı içinde gruplanır.
*   **Test Edilebilirlik:** Yapılandırma nesneleri (`IOptions<T>`), testlerde kolayca sahte (mock) versiyonlarla değiştirilebilir.

#### Implementasyon Adımları:

**a. Options Sınıfı Oluşturma:**
`appsettings.json` dosyasındaki bir bölüme karşılık gelen bir C# sınıfı oluşturulur.

```csharp
// src/Infrastructure/Configuration/RabbitMqOptions.cs
public class RabbitMqOptions
{
    public const string SectionName = "RabbitMqOptions";

    public string Host { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

**b. `Program.cs`'de Kaydetme:**
Bu sınıf, `Program.cs` dosyasında `IConfiguration`'a bağlanır.

```csharp
// src/Presentation/API/Program.cs
builder.Services
    .AddOptions<RabbitMqOptions>()
    .Bind(builder.Configuration.GetSection(RabbitMqOptions.SectionName));
```

**c. Kullanım:**
`IOptions<RabbitMqOptions>` arayüzü, dependency injection ile ihtiyaç duyulan herhangi bir servise enjekte edilebilir.

```csharp
public class MyService
{
    private readonly RabbitMqOptions _rabbitMqOptions;

    public MyService(IOptions<RabbitMqOptions> rabbitMqOptions)
    {
        _rabbitMqOptions = rabbitMqOptions.Value;
    }

    public void Connect()
    {
        var host = _rabbitMqOptions.Host;
        // ...
    }
}
```

---

### 3. Yapılandırma Doğrulaması (Configuration Validation)

Uygulamanın çalışması için kritik olan yapılandırma değerlerinin eksik veya geçersiz olması, çalışma zamanında beklenmedik hatalara yol açabilir. Bunu önlemek için, proje **uygulama başlarken** yapılandırmayı doğrular. Bu, "fail-fast" (hızlı başarısız ol) prensibine uygun bir yaklaşımdır.

Projede bu doğrulama, `FluentValidation` ile entegre bir şekilde yapılır.

#### Implementasyon Adımları:

**a. Validator Sınıfı Oluşturma:**
Options sınıfı için bir `FluentValidation` doğrulayıcısı oluşturulur.

```csharp
// src/Infrastructure/Configuration/RabbitMqOptionsValidator.cs
public class RabbitMqOptionsValidator : AbstractValidator<RabbitMqOptions>
{
    public RabbitMqOptionsValidator()
    {
        RuleFor(x => x.Host).NotEmpty();
        RuleFor(x => x.Username).NotEmpty();
    }
}
```

**b. `Program.cs`'de Doğrulamayı Etkinleştirme:**
Options sınıfı kaydedilirken, `ValidateFluently()` ve `ValidateOnStart()` metodları zincire eklenir.

```csharp
// src/Presentation/API/Program.cs
builder.Services
    .AddOptions<RabbitMqOptions>()
    .Bind(builder.Configuration.GetSection(RabbitMqOptions.SectionName))
    .ValidateFluently()  // FluentValidation ile doğrula
    .ValidateOnStart(); // Uygulama başlarken doğrula
```

Bu yapılandırma sayesinde, eğer `appsettings.json` dosyasında `RabbitMqOptions` bölümü veya `Host`, `Username` gibi gerekli alanlar eksikse, uygulama **başlamadan hemen önce** bir istisna fırlatır. Bu, hataların çok erken bir aşamada tespit edilmesini sağlar.
