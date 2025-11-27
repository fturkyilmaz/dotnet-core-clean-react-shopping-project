namespace ShoppingProject.Domain.Exceptions;

public sealed class InvalidProductTitleException : BaseException
{
    public InvalidProductTitleException(string message) : base(message) { }
}

public sealed class InvalidMoneyAmountException : BaseException
{
    public InvalidMoneyAmountException(string message) : base(message) { }
}

public sealed class InvalidProductCategoryException : BaseException
{
    public InvalidProductCategoryException(string message) : base(message) { }
}

public sealed class InvalidCartItemQuantityException : BaseException
{
    public InvalidCartItemQuantityException(string message) : base(message) { }
}

public sealed class ProductNotFoundException : BaseException
{
    public ProductNotFoundException(int productId)
        : base($"Product with ID {productId} was not found") { }
}

public sealed class CartNotFoundException : BaseException
{
    public CartNotFoundException(int cartId)
        : base($"Cart with ID {cartId} was not found") { }
}

public sealed class InsufficientStockException : BaseException
{
    public InsufficientStockException(int productId, int requested, int available)
        : base($"Insufficient stock for product {productId}. Requested: {requested}, Available: {available}") { }
}

public sealed class InvalidOperationException : BaseException
{
    public InvalidOperationException(string message) : base(message) { }
}
