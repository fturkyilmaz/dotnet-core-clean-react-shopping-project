using ShoppingProject.Application.Common.Models;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Products.Queries.SearchProducts;

public record SearchProductsQuery(DynamicQuery Query, int Index, int Size)
    : IRequest<IPaginate<ProductDto>>;
