using FluentAssertions;
using ShoppingProject.Application.Common.Results;

namespace ShoppingProject.Tests.Application.Common;

/// <summary>
/// Unit tests for the generic Result<T> pattern.
/// Tests monadic operations and functional composition.
/// </summary>
public class ResultOfTTests
{
    [Fact]
    public void Success_CreatesSuccessWithValue()
    {
        // Arrange
        const int expectedValue = 42;

        // Act
        var result = new Result<int>.Success(expectedValue);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.IsFailure.Should().BeFalse();

        if (result is Result<int>.Success success)
        {
            success.Value.Should().Be(expectedValue);
        }
    }

    [Fact]
    public void Failure_CreatesFailureWithErrors()
    {
        // Arrange
        var error = new Error("TestError", "Test error message");

        // Act
        var result = new Result<int>.Failure(error);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
    }

    [Fact]
    public void Match_WithValueReturnsSuccessResult()
    {
        // Arrange
        var result = new Result<int>.Success(42);

        // Act
        var output = result.Match(
            success => $"Value: {success.Value}",
            _ => "Error"
        );

        // Assert
        output.Should().Be("Value: 42");
    }

    [Fact]
    public void Match_WithFailureReturnsErrorResult()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);

        // Act
        var output = result.Match(
            _ => "Success",
            failure => $"Error: {failure.Errors[0].Message}"
        );

        // Assert
        output.Should().Be("Error: Message");
    }

    [Fact]
    public async Task MatchAsync_WithValueReturnsSuccessResult()
    {
        // Arrange
        var result = new Result<int>.Success(42);

        // Act
        var output = await result.MatchAsync(
            async success => { await Task.CompletedTask; return $"Value: {success.Value}"; },
            async _ => { await Task.CompletedTask; return "Error"; }
        );

        // Assert
        output.Should().Be("Value: 42");
    }

    [Fact]
    public void Map_TransformsValueInSuccessResult()
    {
        // Arrange
        var result = new Result<int>.Success(5);

        // Act
        var mappedResult = result.Map(value => value * 2);

        // Assert
        mappedResult.IsSuccess.Should().BeTrue();
        if (mappedResult is Result<int>.Success success)
        {
            success.Value.Should().Be(10);
        }
    }

    [Fact]
    public void Map_PreservesFailure()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);

        // Act
        var mappedResult = result.Map(value => value * 2);

        // Assert
        mappedResult.IsFailure.Should().BeTrue();
    }

    [Fact]
    public void Map_ChangesValueType()
    {
        // Arrange
        var result = new Result<int>.Success(42);

        // Act
        var mappedResult = result.Map(value => value.ToString());

        // Assert
        mappedResult.IsSuccess.Should().BeTrue();
        if (mappedResult is Result<string>.Success success)
        {
            success.Value.Should().Be("42");
        }
    }

    [Fact]
    public async Task MapAsync_TransformsValueAsynchronously()
    {
        // Arrange
        var result = new Result<int>.Success(5);

        // Act
        var mappedResult = await result.MapAsync(async value =>
        {
            await Task.Delay(1);
            return value * 2;
        });

        // Assert
        mappedResult.IsSuccess.Should().BeTrue();
        if (mappedResult is Result<int>.Success success)
        {
            success.Value.Should().Be(10);
        }
    }

    [Fact]
    public void Bind_ChainsMultipleOperations()
    {
        // Arrange
        var result = new Result<int>.Success(5);

        // Act
        var boundResult = result
            .Bind(value => new Result<int>.Success(value * 2))
            .Bind(value => new Result<int>.Success(value + 10));

        // Assert
        boundResult.IsSuccess.Should().BeTrue();
        if (boundResult is Result<int>.Success success)
        {
            success.Value.Should().Be(20); // (5 * 2) + 10
        }
    }

    [Fact]
    public void Bind_ShortCircuitsOnFailure()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);
        var secondOperationCalled = false;

        // Act
        var boundResult = result.Bind(_ =>
        {
            secondOperationCalled = true;
            return new Result<int>.Success(100);
        });

        // Assert
        secondOperationCalled.Should().BeFalse();
        boundResult.IsFailure.Should().BeTrue();
    }

    [Fact]
    public async Task BindAsync_ChainsMultipleAsynchronousOperations()
    {
        // Arrange
        var result = new Result<int>.Success(5);

        // Act
        var boundResult = await result
            .BindAsync(async value =>
            {
                await Task.Delay(1);
                return new Result<int>.Success(value * 2);
            })
            .BindAsync(async value =>
            {
                await Task.Delay(1);
                return new Result<int>.Success(value + 10);
            });

        // Assert
        boundResult.IsSuccess.Should().BeTrue();
        if (boundResult is Result<int>.Success success)
        {
            success.Value.Should().Be(20);
        }
    }

    [Fact]
    public void GetValueOrDefault_ReturnsValueOnSuccess()
    {
        // Arrange
        var result = new Result<int>.Success(42);

        // Act
        var value = result.GetValueOrDefault(0);

        // Assert
        value.Should().Be(42);
    }

    [Fact]
    public void GetValueOrDefault_ReturnsDefaultOnFailure()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);

        // Act
        var value = result.GetValueOrDefault(99);

        // Assert
        value.Should().Be(99);
    }

    [Fact]
    public void ToResult_ConvertsTNonGenericResult()
    {
        // Arrange
        var result = new Result<int>.Success(42);

        // Act
        var nonGenericResult = result.ToResult();

        // Assert
        nonGenericResult.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void ToResult_ConvertFailureToNonGenericResult()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);

        // Act
        var nonGenericResult = result.ToResult();

        // Assert
        nonGenericResult.IsFailure.Should().BeTrue();
    }
}
