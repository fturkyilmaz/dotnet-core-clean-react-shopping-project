using System.Security.Cryptography;
using System.Text;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShoppingProject.Application.Contracts.Audit;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Data;

namespace ShoppingProject.Infrastructure.Bus.Consumers.Audit;

public class AuditEventConsumer : IConsumer<IAuditEvent>
{
    private readonly AuditDbContext _dbContext;
    private readonly ILogger<AuditEventConsumer> _logger;

    public AuditEventConsumer(AuditDbContext dbContext, ILogger<AuditEventConsumer> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<IAuditEvent> context)
    {
        var @event = context.Message;

        // Fetch previous hash for chaining
        var previousLog = await _dbContext
            .AuditLogs.OrderByDescending(x => x.Timestamp)
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync();

        var previousHash =
            previousLog?.Hash ?? "0000000000000000000000000000000000000000000000000000000000000000";

        var auditLog = new AuditLog
        {
            UserId = @event.UserId,
            UserEmail = @event.UserEmail,
            Action = @event.Action,
            EntityName = @event.EntityName,
            EntityId = @event.EntityId,
            OldValues = @event.OldValues,
            NewValues = @event.NewValues,
            Timestamp = @event.Timestamp,
            CorrelationId = @event.CorrelationId,
            RemoteIp = @event.RemoteIp,
            UserAgent = @event.UserAgent,
            PreviousHash = previousHash,
        };

        auditLog.Hash = CalculateHash(auditLog);

        _dbContext.AuditLogs.Add(auditLog);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation(
            "Audit log persisted and chained: {EntityName} - {Action} (Hash: {Hash})",
            @event.EntityName,
            @event.Action,
            auditLog.Hash[..8]
        );
    }

    private static string CalculateHash(AuditLog log)
    {
        var rawData =
            $"{log.UserId}|{log.Action}|{log.EntityName}|{log.EntityId}|{log.OldValues}|{log.NewValues}|{log.Timestamp:O}|{log.CorrelationId}|{log.PreviousHash}";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawData));
        return Convert.ToHexString(bytes);
    }
}
