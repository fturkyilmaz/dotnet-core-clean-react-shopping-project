using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Queries.GetProducts;

/// <summary>
/// Optimized handler for retrieving products with filtering, sorting, and projection.
/// </summary>
public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<GetProductsQueryHandler> _logger;

    public GetProductsQueryHandler(
        IApplicationDbContext context,
        IMapper mapper,
        ILogger<GetProductsQueryHandler> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<ProductDto>> Handle(
        GetProductsQuery request,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Retrieving products with filters - Category: {Category}, Search: {SearchTerm}",
            request.Category, request.SearchTerm);

        // Build query with filtering
        var query = BuildQuery(request);

        // Project to DTO for optimal performance
        var result = await query
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {Count} products", result.Count);

        return result;
    }

    private IQueryable<Product> BuildQuery(GetProductsQuery request)
    {
        // Start with no-tracking for read-only query
        var query = _context.Products.AsNoTracking();

        // Filter by category
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(p => p.Category == request.Category);
        }

        // Filter by price range
        if (request.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= request.MaxPrice.Value);
        }

        // Apply search if provided
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(p =>
                EF.Functions.Like(p.Title.ToLower(), $"%{searchTerm}%") ||
                EF.Functions.Like(p.Description.ToLower(), $"%{searchTerm}%") ||
                EF.Functions.Like(p.Category.ToLower(), $"%{searchTerm}%"));
        }

        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortOrder);

        return query;
    }

    private static IQueryable<Product> ApplySorting(
        IQueryable<Product> query,
        string? sortBy,
        string? sortOrder)
    {
        var isDescending = sortOrder?.ToLower() == "desc";

        return sortBy?.ToLower() switch
        {
            "price" => isDescending
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),
            "title" => isDescending
                ? query.OrderByDescending(p => p.Title)
                : query.OrderBy(p => p.Title),
            "category" => isDescending
                ? query.OrderByDescending(p => p.Category)
                : query.OrderBy(p => p.Category),
            "created" => isDescending
                ? query.OrderByDescending(p => p.Created)
                : query.OrderBy(p => p.Created),
            _ => query.OrderBy(p => p.Id) // Default sort by Id
        };
    }
}
