using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Application.Products.Queries.GetAllProducts;

namespace ShoppingProject.Application.Products.Queries.GetProducts;

public class GetAllProductsQueryHandler
    : IRequestHandler<GetAllProductsQuery, IEnumerable<AdminProductDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAllProductsQueryHandler(
        IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AdminProductDto>> Handle(
        GetAllProductsQuery request,
        CancellationToken cancellationToken)
    {

        return await _context.Products
            .AsNoTracking()
            .ProjectTo<AdminProductDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
