using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Carts.Queries.GetCarts;

public class GetCartsQueryHandler : IRequestHandler<GetCartsQuery, List<CartDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCartsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<CartDto>> Handle(
        GetCartsQuery request,
        CancellationToken cancellationToken
    )
    {
        return await Task.FromResult(
            _context
                .Carts.OrderBy(x => x.Title)
                .ProjectTo<CartDto>(_mapper.ConfigurationProvider)
                .ToList()
        );
    }
}
