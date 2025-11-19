using MediatR;
using MassTransit;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.Interfaces;

namespace ShoppingProject.Domain.Common;

public abstract class BaseEvent : INotification, IEventOrMessage
{
}
