using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Enums;

namespace ShoppingProject.Application.Common.Specifications;

public abstract class ActiveSpecification<T> : BaseSpecification<T>
    where T : BaseEntity
{
    protected ActiveSpecification()
        : base(x => x.Status == EntityStatus.Active)
    {
    }
}
