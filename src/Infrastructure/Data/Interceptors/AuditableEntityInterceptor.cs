using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Text.Json;

namespace ShoppingProject.Infrastructure.Data.Interceptors;

public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    private readonly IUser _user;
    private readonly TimeProvider _dateTime;

    public AuditableEntityInterceptor(IUser user, TimeProvider dateTime)
    {
        _user = user;
        _dateTime = dateTime;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void UpdateEntities(DbContext? context)
    {
        if (context == null) return;

        var utcNow = _dateTime.GetUtcNow().UtcDateTime;
        var userId = _user?.Id ?? "system";
        var userEmail = _user?.Email ?? "system@local";

        var auditableEntries = context.ChangeTracker
            .Entries<BaseAuditableEntity>()
            .Where(entry =>
                entry.State is EntityState.Added or EntityState.Modified or EntityState.Deleted ||
                entry.HasChangedOwnedEntities());

        foreach (var entry in auditableEntries)
        {
            var entity = entry.Entity;
            entity.EntityName = entry.Entity.GetType().Name;
            entity.EntityId = GetPrimaryKeyValue(entry);
            entity.UserId = userId;
            entity.UserEmail = userEmail;

            if (entry.State == EntityState.Added)
            {
                entity.Action = "Added";
                entity.CreatedBy = userId;
                entity.Created = utcNow;
                entity.NewValues = SerializeValues(entry.CurrentValues);
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.Action = "Modified";
                entity.LastModifiedBy = userId;
                entity.LastModified = utcNow;
                entity.OldValues = SerializeValues(entry.OriginalValues);
                entity.NewValues = SerializeValues(entry.CurrentValues);
            }
            else if (entry.State == EntityState.Deleted)
            {
                entity.Action = "Deleted";
                entity.LastModifiedBy = userId;
                entity.LastModified = utcNow;
                entity.OldValues = SerializeValues(entry.OriginalValues);
            }
        }
    }

    private static string GetPrimaryKeyValue(EntityEntry entry)
    {
        var key = entry.Metadata.FindPrimaryKey();
        var vals = key?.Properties.Select(p => entry.Property(p.Name).CurrentValue)?.ToArray() ?? Array.Empty<object>();
        return string.Join("|", vals.Select(v => v?.ToString()));
    }

    private static string SerializeValues(PropertyValues values)
    {
        var dict = values.Properties.ToDictionary(p => p.Name, p => values[p.Name]);
        return JsonSerializer.Serialize(dict);
    }
}

public static class Extensions
{
    public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
        entry.References.Any(r =>
            r.TargetEntry != null &&
            r.TargetEntry.Metadata.IsOwned() &&
            (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified || r.TargetEntry.State == EntityState.Deleted));
}
