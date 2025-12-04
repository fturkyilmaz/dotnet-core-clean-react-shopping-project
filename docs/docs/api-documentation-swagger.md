# API Documentation: Swagger / OpenAPI

## Nedir?

**OpenAPI Specification (eski adıyla Swagger Specification)**, RESTful API'leri belgelemek için dilden bağımsız bir standarttır. API'nin endpoint'lerini, kabul ettiği parametreleri, döndürdüğü yanıtları ve modelleri standart bir formatta (genellikle JSON veya YAML) tanımlar.

**Swagger**, OpenAPI standardını uygulamak için geliştirilmiş bir araç setidir. En bilinen araçları şunlardır:
*   **Swagger UI:** OpenAPI ile belgelenmiş bir API için otomatik olarak interaktif, tarayıcı tabanlı bir kullanıcı arayüzü oluşturur. Bu arayüz sayesinde geliştiriciler API'yi keşfedebilir, endpoint'leri test edebilir ve modelleri inceleyebilir.
*   **Swagger Codegen:** OpenAPI tanım dosyasını kullanarak farklı dillerde (Java, C#, Python, TypeScript vb.) istemci (client) kütüphaneleri veya sunucu taslakları (server stubs) oluşturur.

## Projede Neden Kullanılıyor?

*   **Otomatik ve Güncel Dokümantasyon:** Kodda (örneğin, Controller'lar ve DTO'lar) yapılan değişiklikler doğrudan Swagger UI'a yansıdığı için, dokümantasyonun manuel olarak güncellenmesi gerekmez. Bu, dokümantasyonun her zaman kod ile senkronize kalmasını sağlar.
*   **Geliştirici Deneyimini İyileştirme:** API'yi kullanacak olan geliştiriciler (hem frontend hem de backend), Swagger UI üzerinden API'nin nasıl çalıştığını hızlıca öğrenebilir ve test edebilirler. Bu, entegrasyon sürecini büyük ölçüde hızlandırır.
*   **API Keşfedilebilirliği:** Tüm endpoint'ler, modeller ve olası yanıtlar tek bir yerde listelendiği için API'nin yeteneklerini anlamak kolaylaşır.
*   **İstemci (Client) Üretimini Otomatikleştirme:** `swagger.json` dosyası, frontend veya diğer backend servisleri için API istemci kodlarının otomatik olarak üretilmesini sağlayarak geliştirme sürecini hızlandırır.
*   **API Versiyonlama Desteği:** Projedeki API versiyonlama yapısıyla entegre çalışarak, farklı API versiyonları için ayrı ayrı dokümantasyonlar oluşturulmasını sağlar.

## Projedeki Yapılandırma

Swagger, projenin `API` katmanında yapılandırılmıştır ve özellikle geliştirme (Development) ortamında aktif olacak şekilde ayarlanmıştır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Gerekli Swashbuckle (Swagger'ın .NET implementasyonu) paketleri `ShoppingProject.WebApi.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="Swashbuckle.AspNetCore" />
    <PackageReference Include="Asp.Versioning.Mvc.ApiExplorer" />
    ```

2.  **Servislerin Kaydedilmesi (`Program.cs`):** Swagger generator servisi `Program.cs` dosyasında kaydedilir.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    ```
    *   `AddEndpointsApiExplorer()`: API endpoint'lerini Swagger'ın keşfedebilmesi için gerekli metadata'yı sağlar.
    *   `AddSwaggerGen()`: OpenAPI/Swagger dokümanını (`swagger.json`) oluşturacak olan servisleri ekler.

3.  **API Versiyonlama Entegrasyonu:** Proje, API versiyonlamayı desteklediği için Swagger'ın da bu versiyonları anlaması gerekir. Bu yapılandırma, `ConfigureSwaggerOptions.cs` sınıfında yapılır. Bu sınıf, her API versiyonu için bir Swagger dokümanı oluşturur.

    ```csharp
    // src/Presentation/API/ConfigureSwaggerOptions.cs
    public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly IApiVersionDescriptionProvider _provider;

        public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
        {
            _provider = provider;
        }

        public void Configure(SwaggerGenOptions options)
        {
            // Her bir keşfedilen API versiyonu için bir Swagger dokümanı oluştur
            foreach (var description in _provider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(description.GroupName, CreateInfoForApiVersion(description));
            }
        }
        // ...
    }
    ```
    Bu servis de `Program.cs`'de kaydedilir:
    ```csharp
    builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();
    ```

4.  **Swagger UI'ın Etkinleştirilmesi (`Program.cs`):** Swagger ve Swagger UI middleware'leri, HTTP pipeline'ına eklenir. Bu, sadece **geliştirme (Development)** ortamında yapılır.

    ```csharp
    // src/Presentation/API/Program.cs
    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            // API versiyonlarına göre endpoint'leri UI'da listele
            var descriptions = app.DescribeApiVersions();
            foreach (var description in descriptions)
            {
                options.SwaggerEndpoint(
                    $"/swagger/{description.GroupName}/swagger.json",
                    description.GroupName.ToUpperInvariant()
                );
            }
        });
    }
    ```

Uygulama geliştirme modunda çalıştırıldığında, `/swagger` adresine gidilerek interaktif Swagger UI arayüzüne erişilebilir. Bu arayüz, projedeki tüm API endpoint'lerini, versiyonlarıyla birlikte listeler ve test etme imkanı sunar.
