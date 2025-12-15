using AutoMapper;
using ShoppingProject.Domain.Common;

namespace ShoppingProject.Application.Mappings;

public class PaginateConverter<TSource, TDestination>
    : ITypeConverter<IPaginate<TSource>, IPaginate<TDestination>>
{
    public IPaginate<TDestination> Convert(
        IPaginate<TSource> source,
        IPaginate<TDestination> destination,
        ResolutionContext context
    )
    {
        var items = context.Mapper.Map<IList<TSource>, IList<TDestination>>(source.Items);

        return new Paginate<TDestination>
        {
            Index = source.Index,
            Size = source.Size,
            From = source.From,
            Count = source.Count,
            Pages = source.Pages,
            Items = items,
        };
    }
}
