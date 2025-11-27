using ShoppingProject.Domain.Common;

namespace ShoppingProject.Domain.ValueObjects;

public sealed class Rating : ValueObject
{
    private Rating(double rate, int count)
    {
        Rate = rate;
        Count = count;
    }

    public double Rate { get; }
    public int Count { get; }

    public static Result<Rating> Create(double rate, int count)
    {
        if (rate < 0 || rate > 5)
            return Result.Failure<Rating>("Rating must be between 0 and 5", ErrorType.Validation);

        if (count < 0)
            return Result.Failure<Rating>("Rating count cannot be negative", ErrorType.Validation);

        // Round rate to 1 decimal place
        var roundedRate = Math.Round(rate, 1, MidpointRounding.AwayFromZero);

        return Result.Success(new Rating(roundedRate, count));
    }

    public static Rating Empty => new(0, 0);

    public Rating AddRating(double newRate)
    {
        if (newRate < 0 || newRate > 5)
            throw new ArgumentException("Rating must be between 0 and 5");

        var newTotal = (Rate * Count) + newRate;
        var newCount = Count + 1;
        var newAverageRate = Math.Round(newTotal / newCount, 1, MidpointRounding.AwayFromZero);

        return new Rating(newAverageRate, newCount);
    }

    public bool HasRatings => Count > 0;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Rate;
        yield return Count;
    }

    public override string ToString() => $"{Rate:F1} ({Count} reviews)";
}
