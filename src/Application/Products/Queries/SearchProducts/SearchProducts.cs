using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;
using ShoppingProject.Application.Common.Extensions;
using ShoppingProject.Application.Common.Mappings;
using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Entities;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;

namespace ShoppingProject.Application.Products.Queries.SearchProducts;

public record SearchProductsQuery(DynamicQuery Query, int Index, int Size) : IRequest<IPaginate<ProductDto>>;

public class SearchProductsQueryHandler : IRequestHandler<SearchProductsQuery, IPaginate<ProductDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchProductsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IPaginate<ProductDto>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
    {
        var products = _context.Products.AsQueryable();
        
        // Apply dynamic query
        if (request.Query != null)
        {
            products = products.ToDynamic(request.Query);
        }

        var paginatedProducts = products
            .Skip(request.Index * request.Size)
            .Take(request.Size)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .ToList();

        var totalCount = products.Count();

        return await Task.FromResult(new Paginate<ProductDto>(paginatedProducts, request.Index, request.Size, totalCount));
    }
}
