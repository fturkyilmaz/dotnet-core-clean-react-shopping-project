using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Carts.Queries.GetCarts;

public class CartBriefDto
{
    public int Id { get; init; }
    public string Title { get; init; } = "";
    public decimal Price { get; init; }
    public string Image { get; init; } = "";
    public int Quantity { get; init; } = 1;
}

public record GetCartsQuery : IRequest<List<CartBriefDto>>;

public class GetCartsQueryHandler : IRequestHandler<GetCartsQuery, List<CartBriefDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCartsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<CartBriefDto>> Handle(
        GetCartsQuery request,
        CancellationToken cancellationToken
    )
    {
        return await Task.FromResult(
            _context
                .Carts.OrderBy(x => x.Title)
                .ProjectTo<CartBriefDto>(_mapper.ConfigurationProvider)
                .ToList()
        );
    }
}
