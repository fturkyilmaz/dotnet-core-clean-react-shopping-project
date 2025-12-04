# .NET Core / 10 (C#)

## Nedir?

.NET Core, Microsoft tarafından geliştirilen, açık kaynaklı, platformlar arası (Windows, macOS ve Linux) çalışabilen modern bir geliştirme platformudur. Yüksek performanslı, ölçeklenebilir ve modüler uygulamalar geliştirmek için tasarlanmıştır. C# ise .NET platformu için geliştirilmiş modern, nesne yönelimli bir programlama dilidir.

Bu proje, **.NET 10.0** sürümünü ve **C#** programlama dilini kullanmaktadır.

## Projede Neden Kullanılıyor?

*   **Platform Bağımsızlığı:** Uygulamanın farklı işletim sistemlerinde (Windows, Linux, macOS) sorunsuz bir şekilde çalışabilmesini sağlar. Bu, dağıtım esnekliği açısından büyük bir avantajdır.
*   **Yüksek Performans:** .NET Core, yüksek performanslı web uygulamaları ve servisler oluşturmak için optimize edilmiştir. Asenkron programlama modeli ve verimli bellek yönetimi sayesinde yüksek trafikli uygulamalar için idealdir.
*   **Açık Kaynak ve Topluluk Desteği:** Açık kaynak olması, geniş bir geliştirici topluluğu tarafından sürekli olarak geliştirilmesi ve desteklenmesi anlamına gelir. Bu, projenin güncel teknolojilerle uyumlu kalmasını sağlar.
*   **Modülerlik ve Esneklik:** .NET Core, modüler bir yapıya sahiptir. Bu, sadece ihtiyaç duyulan bileşenlerin projeye dahil edilmesini sağlayarak uygulamanın daha hafif ve hızlı olmasına olanak tanır.
*   **Entegrasyon Kolaylığı:** .NET Core, Docker gibi konteyner teknolojileri ve bulut platformları (Azure, AWS, vb.) ile kolayca entegre olabilir.

## Projedeki Yapılandırma

Projenin ana giriş noktası `src/Presentation/API/Program.cs` dosyasıdır. Bu dosya, uygulamanın başlatılması ve servislerin yapılandırılması için gerekli tüm adımları içerir.

### Ana Yapılandırma Adımları:

1.  **Web Uygulaması Oluşturma:** `WebApplication.CreateBuilder(args)` ile bir web uygulaması oluşturucu (builder) başlatılır. Bu, uygulamanın temel yapılandırmasını içerir.

    ```csharp
    var builder = WebApplication.CreateBuilder(args);
    ```

2.  **Servislerin Eklenmesi:** Projede kullanılacak servisler (veritabanı, önbellekleme, loglama, vb.) `builder.Services` koleksiyonuna eklenir. Örneğin, veritabanı bağlamı (DbContext) ve kimlik doğrulama servisleri burada yapılandırılır.

    ```csharp
    // Örnek Veritabanı yapılandırması
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
    ```

3.  **Uygulama Pipeline'ının Yapılandırılması:** Uygulama başlatıldığında HTTP isteklerinin nasıl işleneceği `app` nesnesi üzerinden yapılandırılır. Bu, middleware'lerin (örneğin, yönlendirme, kimlik doğrulama, yetkilendirme) eklenmesini içerir.

    ```csharp
    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
    ```

4.  **Proje Dosyası (`.csproj`):** `src/Presentation/API/ShoppingProject.WebApi.csproj` dosyası, projenin hedef framework'ünü (`net10.0`) ve bağımlılıklarını (NuGet paketleri) tanımlar.

    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">
      <PropertyGroup>
        <TargetFramework>net10.0</TargetFramework>
        <Nullable>enable</Nullable>
        <ImplicitUsings>enable</ImplicitUsings>
      </PropertyGroup>
      ...
    </Project>
    ```

Bu yapı, projenin modüler, test edilebilir ve bakımı kolay bir şekilde geliştirilmesini sağlar.
