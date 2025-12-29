using System.Text.Json;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Entities;
using ShoppingProject.Infrastructure.Bus.Events;
using ShoppingProject.Infrastructure.Identity;

namespace ShoppingProject.Infrastructure.Data.Interceptors;

public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    private readonly IUser _user;
    private readonly IRequestContext _requestContext;
    private readonly TimeProvider _dateTime;
    private readonly IPublishEndpoint _publishEndpoint;

    public AuditableEntityInterceptor(
        IUser user,
        IRequestContext requestContext,
        TimeProvider dateTime,
        IPublishEndpoint publishEndpoint
    )
    {
        _user = user;
        _requestContext = requestContext;
        _dateTime = dateTime;
        _publishEndpoint = publishEndpoint;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result
    )
    {
        UpdateEntitiesAsync(eventData.Context).GetAwaiter().GetResult();
        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        await UpdateEntitiesAsync(eventData.Context);
        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private async Task UpdateEntitiesAsync(DbContext? context)
    {
        if (context == null)
            return;

        var utcNow = _dateTime.GetUtcNow();
        var userId = _user?.Id ?? "system";
        var userEmail = _user?.Email ?? "system@local";

        var auditableEntries = context
            .ChangeTracker.Entries<BaseAuditableEntity>()
            .Where(entry =>
                entry.State is EntityState.Added or EntityState.Modified or EntityState.Deleted
                || entry.HasChangedOwnedEntities()
            );

        foreach (var entry in auditableEntries)
        {
            var entity = entry.Entity;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedBy = userId;
                entity.Created = utcNow;
            }
            else if (entry.State == EntityState.Modified || entry.HasChangedOwnedEntities())
            {
                entity.LastModifiedBy = userId;
                entity.LastModified = utcNow;
            }

            var auditEvent = new AuditEvent
            {
                UserId = userId,
                UserEmail = userEmail,
                EntityName = entity.GetType().Name,
                EntityId = GetPrimaryKeyValue(entry),
                Timestamp = utcNow,
                Action = entry.State.ToString(),
                CorrelationId = _requestContext.CorrelationId,
                RemoteIp = _requestContext.RemoteIp,
                UserAgent = _requestContext.UserAgent,
            };

            if (entry.State == EntityState.Added)
            {
                auditEvent = auditEvent with
                {
                    NewValues = SerializeValues(entry.CurrentValues, entry),
                };
            }
            else if (entry.State == EntityState.Modified)
            {
                auditEvent = auditEvent with
                {
                    OldValues = SerializeValues(entry.OriginalValues, entry),
                    NewValues = SerializeValues(entry.CurrentValues, entry),
                };
            }
            else if (entry.State == EntityState.Deleted)
            {
                auditEvent = auditEvent with
                {
                    OldValues = SerializeValues(entry.OriginalValues, entry),
                };
            }

            await _publishEndpoint.Publish(auditEvent);
        }
    }

    private static string GetPrimaryKeyValue(EntityEntry entry)
    {
        var key = entry.Metadata.FindPrimaryKey();
        var vals =
            key?.Properties.Select(p => entry.Property(p.Name).CurrentValue)?.ToArray()
            ?? Array.Empty<object>();
        return string.Join("|", vals.Select(v => v?.ToString()));
    }

    private static string SerializeValues(PropertyValues values, EntityEntry entry)
    {
        var dict = values.Properties.ToDictionary(
            property => property.Name,
            property =>
            {
                var propertyInfo = entry.Entity.GetType().GetProperty(property.Name);
                if (
                    propertyInfo != null
                    && Attribute.IsDefined(propertyInfo, typeof(AuditIgnoreAttribute))
                )
                {
                    return (object?)"[MASKED]";
                }
                return values[property.Name];
            }
        );
        return JsonSerializer.Serialize(dict);
    }
}

public static class Extensions
{
    public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
        entry.References.Any(r =>
            r.TargetEntry != null
            && r.TargetEntry.Metadata.IsOwned()
            && (
                r.TargetEntry.State == EntityState.Added
                || r.TargetEntry.State == EntityState.Modified
                || r.TargetEntry.State == EntityState.Deleted
            )
        );
}
