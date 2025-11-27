using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.ValueObjects;
using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.Services;

public class CartService : ICartService
{
    public Result<Cart> CreateCart(string userId)
    {
        return Cart.Create(userId);
    }

    public Result AddItemToCart(Cart cart, Product product, CartItemQuantity quantity)
    {
        if (!CanAddToCart(product, quantity))
            return Result.Failure("Cannot add item to cart: product unavailable or invalid quantity", ErrorType.Validation);

        return cart.AddItem(product, quantity);
    }

    public Result UpdateCartItemQuantity(Cart cart, int productId, int newQuantity)
    {
        return cart.UpdateItemQuantity(productId, newQuantity);
    }

    public Result RemoveItemFromCart(Cart cart, int productId)
    {
        return cart.RemoveItem(productId);
    }

    public void ClearCart(Cart cart)
    {
        cart.Clear();
    }

    public Money CalculateCartTotal(Cart cart)
    {
        return cart.TotalPrice;
    }

    public bool CanAddToCart(Product product, CartItemQuantity quantity)
    {
        // Business rules for adding to cart
        if (!product.IsAvailable)
            return false;

        if (quantity.Value <= 0)
            return false;

        // Additional business rules can be added here
        // e.g., check user limits, product restrictions, etc.

        return true;
    }

    // Additional business methods
    public bool CanCheckout(Cart cart)
    {
        return !cart.IsEmpty && cart.TotalPrice.Amount > 0;
    }

    public bool HasMaximumItems(Cart cart, int maxItems = 50)
    {
        return cart.TotalItems >= maxItems;
    }

    public Result ValidateCartForCheckout(Cart cart)
    {
        if (cart.IsEmpty)
            return Result.Failure("Cart is empty", ErrorType.Validation);

        if (cart.TotalPrice.Amount <= 0)
            return Result.Failure("Invalid cart total", ErrorType.Validation);

        // Additional validation rules
        foreach (var item in cart.Items)
        {
            if (item.Quantity.Value <= 0)
                return Result.Failure($"Invalid quantity for product {item.ProductId}", ErrorType.Validation);
        }

        return Result.Success();
    }
}
