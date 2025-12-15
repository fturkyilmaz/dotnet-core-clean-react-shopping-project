using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;

namespace ShoppingProject.Application.Carts.Queries.GetCartById;

public class GetCartByIdQueryHandler : IRequestHandler<GetCartByIdQuery, CartDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCartByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CartDto> Handle(GetCartByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await Task.FromResult(
            _context
                .Carts.ProjectTo<CartDto>(_mapper.ConfigurationProvider)
                .FirstOrDefault(x => x.Id == request.Id)
        );

        Guard.Against.NotFound(request.Id, entity);

        return entity;
    }
}
