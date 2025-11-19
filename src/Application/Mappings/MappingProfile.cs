using AutoMapper;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Entity to DTO mappings
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
        CreateMap<Rating, RatingDto>().ReverseMap();
        CreateMap<Cart, CartDto>().ReverseMap();
        CreateMap<CreateCartDto, Cart>();
        CreateMap<UpdateCartDto, Cart>();
        
        // Paginate mappings with inline conversion
        CreateMap<IPaginate<Product>, IPaginate<ProductDto>>()
            .ConvertUsing((src, dest, context) =>
            {
                var items = context.Mapper.Map<IList<Product>, IList<ProductDto>>(src.Items);
                return new Paginate<ProductDto>
                {
                    Index = src.Index,
                    Size = src.Size,
                    From = src.From,
                    Count = src.Count,
                    Pages = src.Pages,
                    Items = items
                };
            });
        
        CreateMap<IPaginate<Cart>, IPaginate<CartDto>>()
            .ConvertUsing((src, dest, context) =>
            {
                var items = context.Mapper.Map<IList<Cart>, IList<CartDto>>(src.Items);
                return new Paginate<CartDto>
                {
                    Index = src.Index,
                    Size = src.Size,
                    From = src.From,
                    Count = src.Count,
                    Pages = src.Pages,
                    Items = items
                };
            });
    }
}
