using AutoMapper;
using AutoMapper.QueryableExtensions;
using ShoppingProject.Application.Common.Behaviours;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Products.Queries.GetProductWithPagination;

public class GetProductsWithPaginationQueryHandler
    : IRequestHandler<GetProductsWithPaginationQuery, PaginatedList<ProductDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProductsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ProductDto>> Handle(
        GetProductsWithPaginationQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _context
            .Products.OrderBy(x => x.Title)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);
    }
}
