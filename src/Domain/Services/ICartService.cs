using ShoppingProject.Domain.Entities;
using ShoppingProject.Domain.ValueObjects;

namespace ShoppingProject.Domain.Services;

public interface ICartService
{
    Result<Cart> CreateCart(string userId);

    Result AddItemToCart(Cart cart, Product product, CartItemQuantity quantity);

    Result UpdateCartItemQuantity(Cart cart, int productId, int newQuantity);

    Result RemoveItemFromCart(Cart cart, int productId);

    void ClearCart(Cart cart);

    Money CalculateCartTotal(Cart cart);

    bool CanAddToCart(Product product, CartItemQuantity quantity);
}
