using AutoMapper;
using ShoppingProject.Application.DTOs;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
        CreateMap<Rating, RatingDto>().ReverseMap();
        
        CreateMap(typeof(IPaginate<>), typeof(IPaginate<>)).ConvertUsing(typeof(PaginateConverter<,>));
    }
}

public class PaginateConverter<TSource, TDestination> : ITypeConverter<IPaginate<TSource>, IPaginate<TDestination>>
{
    public IPaginate<TDestination> Convert(IPaginate<TSource> source, IPaginate<TDestination> destination, ResolutionContext context)
    {
        var items = context.Mapper.Map<IList<TSource>, IList<TDestination>>(source.Items);
        return new Paginate<TDestination>
        {
            Index = source.Index,
            Size = source.Size,
            From = source.From,
            Count = source.Count,
            Pages = source.Pages,
            Items = items
        };
    }
}
