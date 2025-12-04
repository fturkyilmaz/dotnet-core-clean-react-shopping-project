# Validation: FluentValidation

## Nedir?

**FluentValidation**, .NET için geliştirilmiş, popüler bir veri doğrulama (validation) kütüphanesidir. Nesneler için doğrulama kurallarını oluşturmak amacıyla "fluent" (akıcı) bir arayüz ve lambda ifadeleri kullanır. Bu yaklaşım, doğrulama kurallarının daha okunaklı ve yazması kolay olmasını sağlar.

## Projede Neden Kullanılıyor?

*   **Okunabilirlik ve Bakım Kolaylığı:** Doğrulama kuralları, `[Required]`, `[StringLength(100)]` gibi attribute'lar yerine, ayrı bir "validator" sınıfı içinde C# kodu olarak tanımlanır. Bu, özellikle karmaşık doğrulama senaryolarında, kuralların daha temiz ve yönetilebilir olmasını sağlar.
*   **Sorumlulukların Ayrılması (Separation of Concerns):** Doğrulama mantığını, model (DTO) sınıflarından ayırarak, model sınıflarının sadece veri taşıma görevine odaklanmasını sağlar. Bu, "Clean Architecture" prensipleriyle uyumludur.
*   **Gelişmiş Doğrulama Senaryoları:** Veritabanı sorgusu gerektiren (örneğin, "bu e-posta adresi daha önce kullanılmış mı?"), koşullu doğrulama (`When`/`Unless`) veya birden fazla özelliğe bağlı karmaşık kurallar gibi senaryoları kolayca uygulamaya olanak tanır.
*   **Test Edilebilirlik:** Validator sınıfları, bağımlılıkları olan (örneğin, bir veritabanı servisi) ve test edilmesi gereken normal sınıflardır. Bu, doğrulama mantığının birim testlerinin (unit tests) kolayca yazılabilmesini sağlar.
*   **ASP.NET Core ile Kolay Entegrasyon:** ASP.NET Core'un model bağlama (model binding) ve doğrulama pipeline'ı ile sorunsuz bir şekilde entegre olur.

## Projedeki Yapılandırma

FluentValidation, `Application` katmanında tanımlanan komut (Command) ve sorgu (Query) nesnelerinin doğrulanması için kullanılır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Gerekli FluentValidation paketleri `ShoppingProject.WebApi.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="FluentValidation.AspNetCore" />
    ```

2.  **Validator Sınıfı Oluşturma:** Doğrulanacak her sınıf için, `AbstractValidator<T>` sınıfından türeyen bir validator sınıfı oluşturulur. `T`, doğrulanacak nesnenin türüdür.

    ```csharp
    // src/Application/Features/Products/Commands/CreateProductCommandValidator.cs
    using FluentValidation;

    public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductCommandValidator()
        {
            RuleFor(v => v.Name)
                .NotEmpty().WithMessage("Ürün adı boş olamaz.")
                .MaximumLength(200).WithMessage("Ürün adı 200 karakterden uzun olamaz.");

            RuleFor(v => v.Price)
                .GreaterThan(0).WithMessage("Fiyat 0'dan büyük olmalıdır.");
        }
    }
    ```
    *   `RuleFor`: Belirli bir özellik için doğrulama kuralı tanımlar.
    *   `.NotEmpty()`: Alanın boş olmamasını sağlar.
    *   `.MaximumLength(200)`: Karakter uzunluğunu sınırlar.
    *   `.GreaterThan(0)`: Sayısal değerin 0'dan büyük olmasını sağlar.
    *   `.WithMessage(...)`: Varsayılan hata mesajını özelleştirir.

3.  **Servislerin Kaydedilmesi (`Program.cs`):** FluentValidation'ın ASP.NET Core ile otomatik olarak çalışması için gerekli servisler `Program.cs` dosyasında kaydedilir.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<Program>();
    ```
    *   `AddFluentValidationAutoValidation`: Gelen isteklerdeki modelleri otomatik olarak doğrulamak için gerekli filtreleri ve servisleri ekler.
    *   `AddValidatorsFromAssemblyContaining<Program>()`: Belirtilen assembly (`ShoppingProject.WebApi`) içerisindeki tüm validator sınıflarını tarar ve dependency injection sistemine kaydeder.

4.  **Otomatik Doğrulama:** Yukarıdaki yapılandırma sayesinde, bir API endpoint'ine `CreateProductCommand` gibi doğrulanabilir bir nesne geldiğinde, ASP.NET Core pipeline'ı otomatik olarak ilgili validator'ı bulur ve çalıştırır. Eğer doğrulama başarısız olursa, pipeline kısa devre yapar ve genellikle 400 Bad Request HTTP durum kodu ile birlikte hata mesajlarını içeren bir yanıt döndürür.

    ```csharp
    // src/Presentation/API/Controllers/ProductsController.cs
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        // Eğer `CreateProductCommand` geçersiz ise, kod bu metoda hiç ulaşmaz.
        // Pipeline, otomatik olarak bir 400 Bad Request yanıtı döner.

        var productId = await _mediator.Send(command);
        return Ok(productId);
    }
    ```

Bu yapı, API'ye gelen verilerin güvenilir ve tutarlı bir şekilde doğrulanmasını sağlar, iş mantığının temiz kalmasına yardımcı olur.
