using Ardalis.GuardClauses;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    private readonly ICacheService _cacheService;

    public GetProductByIdQueryHandler(
        IProductRepository productRepository,
        IMapper mapper,
        ICacheService cacheService
    )
    {
        _productRepository = productRepository;
        _mapper = mapper;
        _cacheService = cacheService;
    }

    public async Task<ProductDto> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken
    )
    {
        var key = $"product-{request.Id}";

        var product = await _cacheService.GetOrSetAsync(
            key,
            async () =>
            {
                var entity = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
                return entity is null ? null : _mapper.Map<ProductDto>(entity);
            },
            TimeSpan.FromMinutes(10),
            cancellationToken
        );

        Guard.Against.NotFound(request.Id, product);

        return product!;
    }
}
