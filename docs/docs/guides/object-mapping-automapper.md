# Object Mapping: AutoMapper

## Nedir?

**AutoMapper**, bir nesne türünü başka bir nesne türüne dönüştürme (eşleme/mapping) işlemini basitleştiren bir kütüphanedir. Geleneksel olarak, `product.Name = productDto.Name; product.Price = productDto.Price;` gibi manuel atama kodları yazmak yerine, AutoMapper konvansiyonlara dayalı olarak bu eşlemeyi otomatik olarak yapar.

## Projede Neden Kullanılıyor?

*   **Kod Tekrarını Önleme:** Manuel nesne atama kodlarının tekrar tekrar yazılmasını engelleyerek kod miktarını azaltır ve daha temiz bir kod tabanı oluşturur.
*   **Sorumlulukların Ayrılması (Separation of Concerns):** Farklı katmanlar arasında farklı nesne modelleri kullanılmasına olanak tanır. Bu, "Clean Architecture" prensipleriyle uyumludur:
    *   **Domain Entities:** Veritabanı yapısını ve iş kurallarını temsil eden çekirdek nesneler (örneğin, `Product`).
    *   **Data Transfer Objects (DTOs):** API'nin dış dünya ile iletişim kurmak için kullandığı nesneler (örneğin, `ProductDto`). Bu nesneler, domain entity'lerinin sadece gerekli olan veya dışarıya gösterilmek istenen alanlarını içerir.
    *   **View Models:** Kullanıcı arayüzüne özel verileri taşıyan nesneler.
*   **Bakım Kolaylığı:** Bir nesneye yeni bir özellik (property) eklendiğinde, sadece AutoMapper profilinde (eğer isimler farklıysa) küçük bir değişiklik yapmak yeterlidir. Manuel eşleme yapılan tüm yerleri bulup güncellemek gerekmez.
*   **LINQ Projeksiyonu (`ProjectTo`):** AutoMapper, `IQueryable` (örneğin, Entity Framework Core sorguları) üzerinde projeksiyon yapma yeteneğine sahiptir. `ProjectTo` metodunu kullanarak, veritabanından sadece DTO'nun ihtiyaç duyduğu kolonları seçen optimize edilmiş SQL sorguları oluşturur. Bu, gereksiz veri çekilmesini önleyerek performansı artırır.

## Projedeki Yapılandırma

AutoMapper, `Application` katmanında yapılandırılmıştır ve genellikle Domain Entity'leri ile DTO'lar arasındaki dönüşümleri gerçekleştirmek için kullanılır.

### Ana Yapılandırma Adımları:

1.  **NuGet Paketlerinin Eklenmesi:** Gerekli AutoMapper paketi `ShoppingProject.Application.csproj` dosyasına eklenmiştir.

    ```xml
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" />
    ```

2.  **Eşleme Profili (Mapping Profile) Oluşturma:** Eşleme kuralları, `Profile` sınıfından türeyen sınıflar içinde tanımlanır. Bu, eşleme yapılandırmasını organize etmeyi kolaylaştırır.

    ```csharp
    // src/Application/Common/Mappings/MappingProfile.cs
    using AutoMapper;
    using ShoppingProject.Application.Features.Products.Queries;
    using ShoppingProject.Domain.Entities;

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Product entity'sini ProductDto'ya nasıl eşleyeceğini tanımlar.
            // Özellik isimleri aynı olduğu için özel bir yapılandırma gerekmez.
            CreateMap<Product, ProductDto>();

            // Farklı eşlemeler buraya eklenebilir.
            // Örnek: CreateMap<Order, OrderDto>();
        }
    }
    ```

3.  **Servislerin Kaydedilmesi (`DependencyInjection.cs`):** AutoMapper servisi, `Application` katmanının `DependencyInjection.cs` dosyasında kaydedilir. `AddAutoMapper` metodu, belirtilen assembly içerisindeki tüm `Profile` sınıflarını tarar ve eşleme yapılandırmalarını yükler.

    ```csharp
    // src/Application/DependencyInjection.cs
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // ...
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            // ...
            return services;
        }
    }
    ```

4.  **Kullanım:** `IMapper` arayüzü, dependency injection ile ihtiyaç duyulan servislere (genellikle MediatR işleyicileri) enjekte edilir.

    *   **Normal Eşleme (`Map`):**
        ```csharp
        // Bir servis veya işleyici içinde
        public async Task<ProductDto> GetProduct(int id)
        {
            var productEntity = await _context.Products.FindAsync(id);
            
            // Product nesnesini ProductDto nesnesine dönüştür
            var productDto = _mapper.Map<ProductDto>(productEntity);

            return productDto;
        }
        ```

    *   **LINQ Projeksiyonu (`ProjectTo`):** Bu yöntem, veritabanı sorgularında tercih edilir.
        ```csharp
        // src/Application/Features/Products/Queries/GetProductsQueryHandler.cs
        public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
        {
            private readonly IApplicationDbContext _context;
            private readonly IMapper _mapper;

            public GetProductsQueryHandler(IApplicationDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
            {
                // Veritabanından sadece ProductDto için gerekli kolonları çeker.
                // SQL: SELECT "p"."Id", "p"."Name", "p"."Price" FROM "Products" AS "p"
                return await _context.Products
                    .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
            }
        }
        ```

Bu yapı, katmanlar arası veri dönüşümlerini verimli, temiz ve yönetilebilir bir şekilde gerçekleştirmeyi sağlar.
