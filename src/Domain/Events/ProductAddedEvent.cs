using ShoppingProject.Domain.Interfaces;

namespace ShoppingProject.Domain.Events;

public class ProductAddedEvent : IEventOrMessage
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}