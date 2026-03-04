using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.Events;
using ShoppingProject.Domain.Exceptions;

namespace ShoppingProject.Domain.Entities;

/// <summary>
/// Shopping cart item entity with rich domain behavior.
/// Encapsulates cart item state and business rules.
/// </summary>
public class Cart : BaseAuditableEntity
{
    // Private fields for encapsulation
    private string _title = string.Empty;
    private decimal _price;
    private string _image = string.Empty;
    private int _quantity = 1;
    private string _ownerId = string.Empty;

    // Public properties with private setters
    public string Title
    {
        get => _title;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Cart item title cannot be empty.");
            if (value.Length > 200)
                throw new DomainException("Cart item title cannot exceed 200 characters.");
            _title = value;
        }
    }

    public decimal Price
    {
        get => _price;
        private set
        {
            if (value < 0)
                throw new DomainException("Cart item price cannot be negative.");
            if (value > 999999.99m)
                throw new DomainException("Cart item price exceeds maximum allowed value.");
            _price = value;
        }
    }

    public string Image
    {
        get => _image;
        private set => _image = value ?? string.Empty;
    }

    public int Quantity
    {
        get => _quantity;
        private set
        {
            if (value < 1)
                throw new DomainException("Cart item quantity must be at least 1.");
            if (value > 1000)
                throw new DomainException("Cart item quantity cannot exceed 1000.");
            _quantity = value;
        }
    }

    public string OwnerId
    {
        get => _ownerId;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Cart item owner ID cannot be empty.");
            _ownerId = value;
        }
    }

    /// <summary>
    /// Gets the total price for this cart item (Price × Quantity).
    /// </summary>
    public decimal TotalPrice => Price * Quantity;

    /// <summary>
    /// Private constructor for EF Core.
    /// </summary>
    private Cart()
    {
    }

    /// <summary>
    /// Creates a new cart item.
    /// </summary>
    public static Cart Create(
        string title,
        decimal price,
        string image,
        int quantity,
        string ownerId)
    {
        var cart = new Cart
        {
            Title = title,
            Price = price,
            Image = image,
            Quantity = quantity,
            OwnerId = ownerId
        };

        cart.AddDomainEvent(new CartCreatedEvent(cart.Id, cart.Title, cart.Price, cart.Quantity, cart.OwnerId));

        return cart;
    }

    /// <summary>
    /// Updates the quantity of the cart item.
    /// </summary>
    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity == Quantity)
            return;

        var oldQuantity = Quantity;
        Quantity = newQuantity;

        AddDomainEvent(new CartQuantityUpdatedEvent(Id, oldQuantity, newQuantity));
    }

    /// <summary>
    /// Updates the cart item details.
    /// </summary>
    public void UpdateDetails(string title, decimal price, string image)
    {
        var hasChanges = false;

        if (!string.Equals(Title, title, StringComparison.Ordinal))
        {
            Title = title;
            hasChanges = true;
        }

        if (Price != price)
        {
            Price = price;
            hasChanges = true;
        }

        if (!string.Equals(Image, image, StringComparison.Ordinal))
        {
            Image = image;
            hasChanges = true;
        }

        if (hasChanges)
        {
            AddDomainEvent(new CartUpdatedEvent(Id, Title, Price, Quantity));
        }
    }

    /// <summary>
    /// Increases the quantity by the specified amount.
    /// </summary>
    public void IncreaseQuantity(int amount = 1)
    {
        if (amount <= 0)
            throw new DomainException("Amount must be greater than zero.");

        UpdateQuantity(Quantity + amount);
    }

    /// <summary>
    /// Decreases the quantity by the specified amount.
    /// If the result is zero or less, the cart item should be removed.
    /// </summary>
    public bool TryDecreaseQuantity(int amount = 1)
    {
        if (amount <= 0)
            throw new DomainException("Amount must be greater than zero.");

        var newQuantity = Quantity - amount;

        if (newQuantity < 1)
            return false; // Signal to remove the cart item

        UpdateQuantity(newQuantity);
        return true;
    }
}
