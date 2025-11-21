using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using Ardalis.GuardClauses;

namespace ShoppingProject.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProductByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await Task.FromResult(_context.Products
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .FirstOrDefault(p => p.Id == request.Id));

        Guard.Against.NotFound(request.Id, product);

        return product;
    }
}
