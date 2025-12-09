using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Services;

public class PushTokenRepository : IPushTokenRepository
{
    private readonly ILogger<PushTokenRepository> _logger;

    public PushTokenRepository(ILogger<PushTokenRepository> logger)
    {
        _logger = logger;
    }

    public Task SaveAsync(string userId, string token, string platform, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Saving push token for user {UserId}, platform {Platform}, token {Token}", userId, platform, token);
        return Task.CompletedTask;
    }
}
