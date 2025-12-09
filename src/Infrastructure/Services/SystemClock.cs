using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Services
{
    public class SystemClock : IClock
    {
        public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    }
}
