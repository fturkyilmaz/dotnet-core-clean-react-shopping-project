using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProducts;

using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

public record GetProductsQuery : IRequest<List<ProductDto>>;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;

    public GetProductsQueryHandler(
        IApplicationDbContext context,
        IMapper mapper,
        IDistributedCache cache
    )
    {
        _context = context;
        _mapper = mapper;
        _cache = cache;
    }

    public async Task<List<ProductDto>> Handle(
        GetProductsQuery request,
        CancellationToken cancellationToken
    )
    {
        const string cacheKey = "products-list";
        var cachedProducts = await _cache.GetStringAsync(cacheKey, cancellationToken);

        if (!string.IsNullOrEmpty(cachedProducts))
        {
            return JsonSerializer.Deserialize<List<ProductDto>>(cachedProducts)!;
        }

        var products = await Task.FromResult(
            _context.Products.ProjectTo<ProductDto>(_mapper.ConfigurationProvider).ToList()
        );

        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
        };

        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(products),
            cacheOptions,
            cancellationToken
        );

        return products;
    }
}
