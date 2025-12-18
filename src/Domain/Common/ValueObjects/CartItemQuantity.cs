using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.ValueObjects;

public sealed class CartItemQuantity : ValueObject
{
    public const int MinValue = 1;
    public const int MaxValue = 99;

    private CartItemQuantity(int value)
    {
        Value = value;
    }

    public int Value { get; }

    public static Result<CartItemQuantity> Create(int quantity)
    {
        if (quantity < MinValue)
            return Result.Failure<CartItemQuantity>($"Quantity must be at least {MinValue}", ErrorType.Validation);

        if (quantity > MaxValue)
            return Result.Failure<CartItemQuantity>($"Quantity cannot exceed {MaxValue}", ErrorType.Validation);

        return Result.Success(new CartItemQuantity(quantity));
    }

    public static CartItemQuantity Default => new(MinValue);

    public CartItemQuantity Increase()
    {
        if (Value >= MaxValue)
            throw new System.InvalidOperationException($"Cannot increase quantity beyond {MaxValue}");

        return new CartItemQuantity(Value + 1);
    }

    public CartItemQuantity Decrease()
    {
        if (Value <= MinValue)
            throw new System.InvalidOperationException($"Cannot decrease quantity below {MinValue}");

        return new CartItemQuantity(Value - 1);
    }

    public static CartItemQuantity Update(int newQuantity)
    {
        if (newQuantity < MinValue || newQuantity > MaxValue)
            throw new ArgumentException($"Quantity must be between {MinValue} and {MaxValue}");

        return new CartItemQuantity(newQuantity);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value.ToString();
}
