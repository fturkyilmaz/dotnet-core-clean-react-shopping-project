using System;

namespace ShoppingProject.Application.Common.Interfaces
{
    public interface IClock
    {
        DateTimeOffset UtcNow { get; }
    }
}
