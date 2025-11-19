using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Domain.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ShoppingProject.Application.Carts.Queries.GetCarts;

public class CartBriefDto
{
    public int Id { get; init; }
    public string Title { get; init; } = "";
    public decimal Price { get; init; }
    public string Image { get; init; } = "";
    public int Quantity { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Cart, CartBriefDto>();
        }
    }
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

    public async Task<List<CartBriefDto>> Handle(GetCartsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Carts
            .OrderBy(x => x.Title)
            .ProjectTo<CartBriefDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
