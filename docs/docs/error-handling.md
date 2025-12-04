# Hata Yönetimi (Error Handling)

## Nedir?

Hata yönetimi, bir uygulamada meydana gelen beklenmedik durumların (istisnalar/exceptions) yönetilmesi sürecidir. İyi bir hata yönetimi stratejisi, uygulamanın kararlılığını artırır, hata ayıklamayı kolaylaştırır ve istemcilere (API kullanıcıları, frontend uygulamaları) anlamlı ve tutarlı hata yanıtları sunar.

Proje, .NET 8 ile birlikte gelen **merkezi istisna işleme (centralized exception handling)** mekanizmasını kullanır. Bu yaklaşım, uygulama genelinde fırlatılan tüm istisnaları tek bir yerden yakalayıp işlemeyi sağlar.

## Projedeki Yaklaşım

Projenin hata yönetimi stratejisi, `src/Presentation/API/Handlers/GlobalExceptionHandler.cs` dosyasında bulunan `GlobalExceptionHandler` sınıfı üzerine kuruludur. Bu sınıf, `IExceptionHandler` arayüzünü uygular.

### Temel Prensip

1.  **Merkezi Yakalama:** Uygulamanın herhangi bir yerinde (örneğin, bir MediatR işleyicisi veya bir servis içinde) bir istisna fırlatıldığında ve bu istisna yerel olarak `try-catch` blokları ile yakalanmadığında, .NET'in istisna işleme pipeline'ı devreye girer ve bu istisnayı `GlobalExceptionHandler`'a iletir.
2.  **İstisna Haritalama (Exception Mapping):** `GlobalExceptionHandler`, gelen istisnanın türüne göre farklı ve standartlaştırılmış HTTP yanıtları oluşturur. Örneğin:
    *   `NotFoundException` fırlatıldığında -> `404 Not Found` durum kodu döner.
    *   `ValidationException` fırlatıldığında -> `422 Unprocessable Entity` durum kodu döner.
    *   Bilinmeyen veya beklenmedik bir istisna olduğunda -> `500 Internal Server Error` durum kodu döner.
3.  **Standartlaştırılmış Hata Yanıtı (RFC 7807 ProblemDetails):** Tüm hata yanıtları, [RFC 7807](https://tools.ietf.org/html/rfc7807) standardına uygun olan `ProblemDetails` formatında JSON nesneleri olarak döndürülür. Bu, API istemcilerinin hataları programatik olarak işlemesini kolaylaştırır.

### Yapılandırma

`GlobalExceptionHandler`, `Program.cs` dosyasında ASP.NET Core servislerine kaydedilir:

```csharp
// src/Presentation/API/Program.cs

// ...
builder.Services.AddExceptionHandler<ShoppingProject.WebApi.Handlers.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
// ...

var app = builder.Build();

app.UseExceptionHandler();
// ...
```
*   `AddExceptionHandler<GlobalExceptionHandler>()`: Özel istisna işleyicimizi servislere ekler.
*   `UseExceptionHandler()`: Middleware pipeline'ına istisna işleme katmanını ekler, böylece yakalanmayan tüm istisnalar `GlobalExceptionHandler`'a yönlendirilir.

### Özel İstisna (Custom Exception) Türleri

Proje, iş mantığına özgü hata durumlarını daha anlamlı bir şekilde ifade etmek için `src/Application/Common/Exceptions/` klasörü altında özel istisna sınıfları tanımlar:

*   **`NotFoundException`:** Bir kaynak (örneğin, belirli bir ID'ye sahip bir ürün) bulunamadığında fırlatılır.
*   **`ValidationException`:** FluentValidation kuralları başarısız olduğunda fırlatılır.
*   **`BadRequestException`:** İsteğin kendisi anlamsal olarak hatalı olduğunda fırlatılır.
*   **`ForbiddenAccessException`:** Kullanıcının bir kaynağa erişim yetkisi olmadığında fırlatılır.

Bu özel istisnalar, `GlobalExceptionHandler` tarafından tanınır ve uygun HTTP durum kodlarına ve hata mesajlarına dönüştürülür.

### Örnek Hata Yanıtı

Bir `ValidationException` fırlatıldığında, istemciye aşağıdaki gibi bir yanıt döner:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Failed",
  "status": 422,
  "detail": "Bir veya daha fazla doğrulama hatası oluştu.",
  "instance": "/api/products",
  "errorType": "Validation",
  "errorCode": "VALIDATION_ERROR",
  "correlationId": "0HL...",
  "errors": {
    "Name": [
      "Ürün adı boş olamaz."
    ],
    "Price": [
      "Fiyat 0'dan büyük olmalıdır."
    ]
  }
}
```

Bu yapı, uygulamanın hem geliştiriciler hem de API tüketicileri için öngörülebilir, tutarlı ve yönetimi kolay bir hata işleme mekanizmasına sahip olmasını sağlar.
