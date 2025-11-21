using ShoppingProject.Domain.Common;
using MediatR;

namespace ShoppingProject.Application.Common.Models;

public class DomainEventNotification<TDomainEvent> : INotification where TDomainEvent : BaseEvent
{
    public DomainEventNotification(TDomainEvent domainEvent)
    {
        DomainEvent = domainEvent;
    }

    public TDomainEvent DomainEvent { get; }
}
