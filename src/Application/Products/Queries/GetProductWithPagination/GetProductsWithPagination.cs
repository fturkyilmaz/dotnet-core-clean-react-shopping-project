using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Products.Queries.GetProductWithPagination;

public record GetProductsWithPaginationQuery : IRequest<PaginatedList<ProductBriefDto>>
{
    public int ListId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}

public class GetProductsWithPaginationQueryHandler : IRequestHandler<GetProductsWithPaginationQuery, PaginatedList<ProductBriefDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProductsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ProductBriefDto>> Handle(GetProductsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(x => x.ListId == request.ListId)
            .OrderBy(x => x.Title)
            .ProjectTo<ProductBriefDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);
    }
}
