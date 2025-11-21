using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Application.Carts.Queries.GetCarts;
using ShoppingProject.Domain.Entities;
using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;

namespace ShoppingProject.Application.Carts.Queries.GetCartById;

public record GetCartByIdQuery(int Id) : IRequest<CartBriefDto>;

public class GetCartByIdQueryHandler : IRequestHandler<GetCartByIdQuery, CartBriefDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCartByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CartBriefDto> Handle(GetCartByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await Task.FromResult(_context.Carts
            .ProjectTo<CartBriefDto>(_mapper.ConfigurationProvider)
            .FirstOrDefault(x => x.Id == request.Id));

        Guard.Against.NotFound(request.Id, entity);

        return entity;
    }
}
