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

        return await _cacheService.GetOrSetAsync(
            key,
            async () =>
            {
                var product = await _context
                    .Products
                    .Where(p => p.Id == request.Id)
                    .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(cancellationToken);

                Guard.Against.NotFound(request.Id, product);

                return product;
            },
            TimeSpan.FromMinutes(10),
            cancellationToken
        );
    }
}
