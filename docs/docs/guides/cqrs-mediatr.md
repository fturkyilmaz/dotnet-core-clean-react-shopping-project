# CQRS (MediatR)

## Nedir?

**CQRS (Command Query Responsibility Segregation)**, bir uygulamanın veri okuma (Query) ve veri yazma (Command) operasyonlarını birbirinden ayıran bir mimari tasarım desenidir. Bu ayrım, her iki tarafın da bağımsız olarak optimize edilmesine olanak tanır.

**MediatR**, .NET için geliştirilmiş, basit bir "mediator" (arabulucu) deseni implementasyonudur. CQRS desenini uygulamak için sıklıkla kullanılır. Komutları (Commands) ve sorguları (Queries) ilgili işleyicilere (Handlers) yönlendirerek sistemdeki bileşenler arasındaki bağımlılığı azaltır.

## Projede Neden Kullanılıyor?

*   **Sorumlulukların Ayrılması (Separation of Concerns):** Veri yazma (örneğin, yeni bir ürün ekleme) ve veri okuma (örneğin, ürünleri listeleme) operasyonlarının mantığını birbirinden ayırır. Bu, kodun daha temiz, anlaşılır ve bakımı kolay olmasını sağlar.
*   **Ölçeklenebilirlik:** Okuma ve yazma operasyonları farklı gereksinimlere sahip olabilir. Örneğin, bir e-ticaret sitesinde ürünleri listeleme işlemi, yeni bir ürün ekleme işleminden çok daha sık gerçekleşir. CQRS, bu iki operasyonun bağımsız olarak ölçeklendirilmesine olanak tanır.
*   **Performans Optimizasyonu:** Okuma operasyonları için optimize edilmiş veri modelleri (örneğin, DTO'lar) kullanılabilirken, yazma operasyonları için daha karmaşık iş mantığı ve doğrulama kuralları içeren domain modelleri kullanılabilir.
*   **Esneklik:** Yazma ve okuma operasyonları için farklı veritabanları veya teknolojiler kullanma esnekliği sunar.

## Projedeki Yapılandırma

Projede MediatR kütüphanesi, CQRS desenini uygulamak için kullanılır. `Application` katmanı, komutları, sorguları ve bunların işleyicilerini içerir.

### Ana Yapılandırma Adımları:

1.  **MediatR Kütüphanesinin Eklenmesi:** MediatR, `ShoppingProject.Application.csproj` dosyasına bir bağımlılık olarak eklenmiştir.

    ```xml
    <PackageReference Include="MediatR" />
    ```

2.  **Servislerin Kaydedilmesi:** `src/Application/DependencyInjection.cs` dosyasında, MediatR servisleri `IServiceCollection`'a eklenir. `AddMediatR` metodu, belirtilen assembly içerisindeki tüm komutları, sorguları ve işleyicileri tarayarak otomatik olarak kaydeder.

    ```csharp
    // src/Application/DependencyInjection.cs
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddMediatR(cfg => 
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            
            // ... diğer servisler
            
            return services;
        }
    }
    ```

3.  **Komut (Command) ve İşleyici (Handler) Örneği:**
    *   **Komut:** Bir işlemi tetikleyen ve genellikle bir sonuç döndürmeyen bir nesnedir. Örneğin, `CreateProductCommand`.
    *   **İşleyici:** Komutu alan ve işleyen sınıftır. Örneğin, `CreateProductCommandHandler`.

    ```csharp
    // Application/Features/Products/Commands/CreateProductCommand.cs
    public class CreateProductCommand : IRequest<int>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    // Application/Features/Products/Commands/CreateProductCommandHandler.cs
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateProductCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = new Product
            {
                Name = request.Name,
                Price = request.Price
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync(cancellationToken);

            return product.Id;
        }
    }
    ```

4.  **Sorgu (Query) ve İşleyici (Handler) Örneği:**
    *   **Sorgu:** Bir veya daha fazla veri döndüren bir nesnedir. Örneğin, `GetProductsQuery`.
    *   **İşleyici:** Sorguyu alan ve veritabanından veya başka bir kaynaktan veriyi getiren sınıftır. Örneğin, `GetProductsQueryHandler`.

    ```csharp
    // Application/Features/Products/Queries/GetProductsQuery.cs
    public class GetProductsQuery : IRequest<IEnumerable<ProductDto>>
    {
    }

    // Application/Features/Products/Queries/GetProductsQueryHandler.cs
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
            return await _context.Products
                .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
    ```

5.  **Controller'da Kullanım:** `API` katmanındaki `Controller`'lar, `IMediator` arayüzünü enjekte ederek komutları ve sorguları gönderir.

    ```csharp
    // Presentation/API/Controllers/ProductsController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductCommand command)
        {
            var productId = await _mediator.Send(command);
            return Ok(productId);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _mediator.Send(new GetProductsQuery());
            return Ok(products);
        }
    }
    ```

Bu yapı, iş mantığının `Controller`'lardan ayrı, kendi sınıflarında (işleyiciler) yaşamasını sağlar. Bu da kodun daha organize, test edilebilir ve yeniden kullanılabilir olmasına yardımcı olur.
