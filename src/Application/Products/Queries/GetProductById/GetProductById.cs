using Ardalis.GuardClauses;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICacheService _cacheService;

    public GetProductByIdQueryHandler(
        IApplicationDbContext context,
        IMapper mapper,
        ICacheService cacheService
    )
    {
        _context = context;
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
                var entity = await _context
                    .Products
                    .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

                if (entity == null)
                    return null;

                return _mapper.Map<ProductDto>(entity);
            },
            TimeSpan.FromMinutes(10),
            cancellationToken
        );

        Guard.Against.NotFound(request.Id, product);

        return product;
    }
}
