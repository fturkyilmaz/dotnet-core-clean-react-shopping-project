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

        // Generic paginate mappings
        CreateMap<IPaginate<Product>, IPaginate<ProductDto>>()
            .ConvertUsing<PaginateConverter<Product, ProductDto>>();

        CreateMap<IPaginate<Cart>, IPaginate<CartDto>>()
            .ConvertUsing<PaginateConverter<Cart, CartDto>>();
    }
}
