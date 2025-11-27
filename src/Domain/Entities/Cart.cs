using ShoppingProject.Domain.Common;
using ShoppingProject.Domain.ValueObjects;
using ShoppingProject.Domain.Events;

namespace ShoppingProject.Domain.Entities;

public class Cart : BaseAuditableEntity
{
    private readonly List<CartItem> _items = new();

    private Cart() { } // EF Core için gerekli

    private Cart(string userId)
    {
        UserId = userId;
        AddDomainEvent(new CartCreatedEvent(Id, userId));
    }

    public string UserId { get; private set; } = null!;
    public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly();

    public Money TotalPrice => _items.Any()
        ? _items.Aggregate(Money.Zero(), (total, item) => total.Add(item.TotalPrice))
        : Money.Zero();

    public int TotalItems => _items.Sum(item => item.Quantity.Value);

    public static Result<Cart> Create(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result.Failure<Cart>("User ID cannot be empty", ErrorType.Validation);

        return Result.Success(new Cart(userId));
    }

    public Result AddItem(Product product, CartItemQuantity quantity)
    {
        if (product is null)
            return Result.Failure("Product cannot be null", ErrorType.Validation);

        var existingItem = _items.FirstOrDefault(item => item.ProductId == product.Id);

        if (existingItem is not null)
        {
            return UpdateItemQuantity(product.Id, existingItem.Quantity.Value + quantity.Value);
        }

        var cartItem = new CartItem(product.Id, product.Title, product.Price, product.Image, quantity);
        _items.Add(cartItem);

        AddDomainEvent(new CartItemAddedEvent(Id, product.Id, quantity.Value));
        return Result.Success();
    }

    public Result UpdateItemQuantity(int productId, int newQuantity)
    {
        var item = _items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null)
            return Result.Failure("Item not found in cart", ErrorType.NotFound);

        var quantityResult = CartItemQuantity.Create(newQuantity);
        if (quantityResult.IsFailure)
            return Result.Failure(quantityResult.Error, quantityResult.ErrorType);

        var oldQuantity = item.Quantity;
        item.UpdateQuantity(quantityResult.Value);

        if (quantityResult.Value.Value == 0)
        {
            _items.Remove(item);
            AddDomainEvent(new CartItemRemovedEvent(Id, productId));
        }
        else
        {
            AddDomainEvent(new CartItemQuantityChangedEvent(Id, productId, oldQuantity.Value, quantityResult.Value.Value));
        }

        return Result.Success();
    }

    public Result RemoveItem(int productId)
    {
        var item = _items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null)
            return Result.Failure("Item not found in cart", ErrorType.NotFound);

        _items.Remove(item);
        AddDomainEvent(new CartItemRemovedEvent(Id, productId));
        return Result.Success();
    }

    public void Clear()
    {
        _items.Clear();
        AddDomainEvent(new CartClearedEvent(Id));
    }

    public bool IsEmpty => !_items.Any();

    public bool ContainsProduct(int productId) => _items.Any(item => item.ProductId == productId);

    // Business Rules
    public bool CanAddItem(Product product, CartItemQuantity quantity)
    {
        if (!product.CanBeAddedToCart(quantity))
            return false;

        // Business rule: Maximum 50 items per cart
        if (TotalItems + quantity.Value > BusinessRules.MaxItemsPerCart)
            return false;

        // Business rule: Maximum 10 different products per cart
        if (!_items.Any(item => item.ProductId == product.Id) && _items.Count >= BusinessRules.MaxDifferentProducts)
            return false;

        return true;
    }

    public bool CanCheckout()
    {
        // Business rule: Cart must not be empty
        if (IsEmpty)
            return false;

        // Business rule: Total must be greater than zero
        if (TotalPrice.Amount <= 0)
            return false;

        // Business rule: All items must have valid quantities
        return _items.All(item => item.Quantity.Value > 0);
    }

    public bool CanUpdateQuantity(int productId, int newQuantity)
    {
        if (newQuantity <= 0)
            return true; // Removing item is allowed

        var item = _items.FirstOrDefault(i => i.ProductId == productId);
        if (item == null)
            return false;

        // Business rule: New total items shouldn't exceed maximum
        var otherItemsTotal = TotalItems - item.Quantity.Value;
        return (otherItemsTotal + newQuantity) <= BusinessRules.MaxItemsPerCart;
    }

    public static class BusinessRules
    {
        public const int MaxItemsPerCart = 50;
        public const int MaxDifferentProducts = 10;
        public const decimal MinimumOrderTotal = 0.01m;
        public const decimal MaximumOrderTotal = 50000.00m;
    }
}

public class CartItem
{
    private CartItem() { } // EF Core için gerekli

    public CartItem(int productId, ProductTitle title, Money price, ProductImage image, CartItemQuantity quantity)
    {
        ProductId = productId;
        Title = title.Value;
        Price = price.Amount;
        Image = image.Url;
        Quantity = quantity;
    }

    public int ProductId { get; private set; }
    public string Title { get; private set; } = null!;
    public decimal Price { get; private set; }
    public string Image { get; private set; } = null!;
    public CartItemQuantity Quantity { get; private set; } = null!;

    public Money TotalPrice => Money.Create(Price * Quantity.Value, "USD").Value;

    public void UpdateQuantity(CartItemQuantity newQuantity)
    {
        Quantity = newQuantity;
    }
}