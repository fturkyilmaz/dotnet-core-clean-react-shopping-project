using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ShoppingProject.Application.Common.Extensions;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Queries.SearchProducts;

public class SearchProductsQueryHandler
    : IRequestHandler<SearchProductsQuery, IPaginate<ProductDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchProductsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IPaginate<ProductDto>> Handle(
        SearchProductsQuery request,
        CancellationToken cancellationToken
    )
    {
        var products = _context.Products.AsQueryable();

        if (request.Query is not null)
        {
            products = products.ToDynamic(request.Query);
        }

        var totalCount = await products.CountAsync(cancellationToken);

        var paginatedProducts = await products
            .Skip(request.Index * request.Size)
            .Take(request.Size)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new Paginate<ProductDto>
        {
            Items = paginatedProducts,
            Index = request.Index,
            Size = request.Size,
            Count = totalCount,
            Pages = (int)Math.Ceiling(totalCount / (double)request.Size),
        };
    }
}
