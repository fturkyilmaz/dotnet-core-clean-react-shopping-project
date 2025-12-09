using System.Threading;
using System.Threading.Tasks;

namespace ShoppingProject.Application.Common.Interfaces
{
    public interface IPushTokenRepository
    {
        Task SaveAsync(string userId, string token, string platform, CancellationToken cancellationToken = default);
    }
}
