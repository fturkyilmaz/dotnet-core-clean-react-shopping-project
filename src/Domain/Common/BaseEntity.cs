using System.ComponentModel.DataAnnotations.Schema;
using InvalidOperationException = ShoppingProject.Domain.Exceptions.InvalidOperationException;

namespace ShoppingProject.Domain.Common;

public abstract class BaseEntity
{
    public int Id { get; set; }

    public EntityStatus Status { get; set; } = EntityStatus.Active;

    private readonly List<BaseEvent> _domainEvents = new();

    public void Activate()
    {
        if (Status == EntityStatus.Deleted)
            throw new InvalidOperationException("Deleted entity cannot be activated.");

        Status = EntityStatus.Active;
    }

    public void Deactivate()
    {
        if (Status != EntityStatus.Active)
            throw new InvalidOperationException("Only active entities can be deactivated.");

        Status = EntityStatus.Passive;
    }

    public void Delete()
    {
        if (Status == EntityStatus.Deleted)
            return;

        Status = EntityStatus.Deleted;
    }

     public void Draft()
    {
        if (Status == EntityStatus.Draft)
            return;

        Status = EntityStatus.Draft;
    }

    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void RemoveDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}
