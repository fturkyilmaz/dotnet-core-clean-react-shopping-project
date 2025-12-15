using ShoppingProject.Application.Common.Exceptions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Queries.GetProductById;

public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
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
        var cacheKey = $"product-{request.Id}";

        var product = await _cacheService.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                var entity = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
                return entity is null ? null : _mapper.Map<ProductDto>(entity);
            },
            TimeSpan.FromMinutes(10),
            cancellationToken
        );

        if (product is null)
        {
            throw new NotFoundException(nameof(Product), request.Id);
        }

        return product;
    }
}
