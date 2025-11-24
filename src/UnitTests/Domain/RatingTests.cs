using FluentAssertions;
using ShoppingProject.Domain.Entities;

namespace ShoppingProject.UnitTests.Domain;

public class RatingTests
{
    [Fact]
    public void CreateRating_WithValidData_ShouldSucceed()
    {
        // Arrange
        double rate = 4.5;
        int count = 120;

        // Act
        var rating = new Rating { Rate = rate, Count = count };

        // Assert
        rating.Rate.Should().Be(rate);
        rating.Count.Should().Be(count);
    }

    [Theory]
    [InlineData(0.0, 0)]
    [InlineData(1.0, 1)]
    [InlineData(5.0, 1000)]
    [InlineData(3.5, 50)]
    public void CreateRating_WithVariousValues_ShouldSucceed(double rate, int count)
    {
        // Act
        var rating = new Rating { Rate = rate, Count = count };

        // Assert
        rating.Rate.Should().Be(rate);
        rating.Count.Should().Be(count);
    }

    [Fact]
    public void CreateRating_DefaultValues_ShouldBeZero()
    {
        // Act
        var rating = new Rating();

        // Assert
        rating.Rate.Should().Be(0.0);
        rating.Count.Should().Be(0);
    }

    [Fact]
    public void Rating_ShouldBeValueObject()
    {
        // Arrange
        var rating1 = new Rating { Rate = 4.5, Count = 100 };
        var rating2 = new Rating { Rate = 4.5, Count = 100 };

        // Assert - Value objects should be compared by value, not reference
        rating1.Should().NotBeSameAs(rating2);
        rating1.Rate.Should().Be(rating2.Rate);
        rating1.Count.Should().Be(rating2.Count);
    }
}
