using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingProject.Domain.Common;

public abstract class BaseEntity
{
    public int Id { get; set; }

    public EntityStatus Status { get; set; } = EntityStatus.Active;

    private readonly List<BaseEvent> _domainEvents = new();

    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void SetStatus(EntityStatus status)
    {
        Status = status;
    }

    public void Activate() => SetStatus(EntityStatus.Active);
    public void Deactivate() => SetStatus(EntityStatus.Passive);
    public void MarkAsDeleted() => SetStatus(EntityStatus.Deleted);

    public void AddDomainEvent(BaseEvent domainEvent) => _domainEvents.Add(domainEvent);
    public void RemoveDomainEvent(BaseEvent domainEvent) => _domainEvents.Remove(domainEvent);
    public void ClearDomainEvents() => _domainEvents.Clear();
}
