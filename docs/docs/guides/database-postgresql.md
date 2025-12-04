# Veritabanı: PostgreSQL (Entity Framework Core)

## Nedir?

**PostgreSQL**, güçlü, açık kaynaklı, nesne-ilişkisel bir veritabanı sistemidir. Güvenilirlik, özellik zenginliği ve performans konularında kendini kanıtlamış, yaygın olarak kullanılan bir veritabanıdır.

**Entity Framework Core (EF Core)**, .NET geliştiricilerinin .NET nesneleri kullanarak veritabanlarıyla çalışmasını sağlayan modern, nesne-ilişkisel bir eşleyici (O/RM)'dir. Geliştiricilerin SQL sorguları yazmak yerine C# kodları ile veritabanı işlemleri yapmasına olanak tanır.

## Projede Neden Kullanılıyor?

*   **Açık Kaynak ve Ücretsiz:** PostgreSQL, herhangi bir lisans maliyeti olmadan kullanılabilen güçlü bir veritabanı çözümüdür.
*   **Gelişmiş Özellikler:** JSON desteği, tam metin arama, coğrafi veri türleri gibi gelişmiş özellikleri destekler. Bu, projenin gelecekteki ihtiyaçlarına cevap verebilme esnekliği sağlar.
*   **Güvenilirlik ve Kararlılık:** PostgreSQL, veri bütünlüğü ve kararlılığı konusunda güçlü bir üne sahiptir. Bu, kritik iş uygulamaları için önemli bir avantajdır.
*   **EF Core ile Kolay Entegrasyon:** EF Core, geliştirme sürecini hızlandırır ve veritabanı işlemlerini basitleştirir.
    *   **Kod Odaklı (Code-First) Geliştirme:** Veritabanı şeması, C# sınıfları (Entity'ler) üzerinden yönetilir. Bu, veritabanı modelinin uygulama koduyla birlikte sürdürülmesini kolaylaştırır.
    *   **Veritabanı Bağımsızlığı:** EF Core, teorik olarak farklı veritabanı sistemlerine (SQL Server, SQLite, vb.) geçişi kolaylaştırır.
    *   **LINQ Entegrasyonu:** Veritabanı sorguları, SQL yerine C# içerisinden LINQ (Language Integrated Query) kullanılarak yazılır. Bu, derleme zamanında tip kontrolü sağlar ve hataları azaltır.

## Projedeki Yapılandırma

Projede PostgreSQL ve EF Core entegrasyonu `Infrastructure` katmanında yapılandırılmıştır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** PostgreSQL sağlayıcısı, `ShoppingProject.Infrastructure.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" />
    ```

2.  **Bağlantı Dizesi (Connection String):** Veritabanı bağlantı bilgileri, `appsettings.json` dosyasında saklanır. Bu, farklı ortamlar (Geliştirme, Üretim) için farklı veritabanı ayarlarının kullanılmasına olanak tanır.

    ```json
    // src/Presentation/API/appsettings.json
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Port=5432;Database=ShoppingDb;User Id=admin;Password=password;"
    }
    ```

3.  **DbContext Sınıfı:** `ApplicationDbContext`, EF Core'un veritabanı ile iletişim kurmasını sağlayan ana sınıftır. Bu sınıf, `Infrastructure/Data/ApplicationDbContext.cs` dosyasında bulunur. Veritabanı tablolarını temsil eden `DbSet` özelliklerini ve model yapılandırmalarını içerir.

    ```csharp
    // src/Infrastructure/Data/ApplicationDbContext.cs
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
    ```

4.  **DbContext'in Kaydedilmesi:** `ApplicationDbContext`, `Program.cs` dosyasında servis koleksiyonuna eklenir. `UseNpgsql` metodu, PostgreSQL sağlayıcısını kullanacağını ve bağlantı dizesini yapılandırma dosyasından alacağını belirtir.

    ```csharp
    // src/Presentation/API/Program.cs
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
    ```

5.  **Veritabanı Geçişleri (Migrations):** Veritabanı şeması, EF Core Migrations kullanılarak yönetilir. Model sınıflarında bir değişiklik yapıldığında, yeni bir "migration" oluşturulur ve bu "migration" veritabanına uygulanarak şema güncellenir.
    *   Yeni bir migration oluşturmak için: `dotnet ef migrations add InitialCreate`
    *   Migration'ı veritabanına uygulamak için: `dotnet ef database update`

Bu yapı, veritabanı işlemlerinin güvenli, yönetilebilir ve modern bir şekilde yapılmasını sağlar.
