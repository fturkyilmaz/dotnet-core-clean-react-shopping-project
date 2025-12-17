using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Exceptions;
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
        var entity = await _context
            .Carts.Where(c => c.Id == request.Id)
            .ProjectTo<CartDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException($"Cart with Id {request.Id} was not found.");
        }

        return entity;
    }
}
