using FluentAssertions;
using ShoppingProject.Application.Common.Results;

namespace ShoppingProject.Tests.Application.Common;

/// <summary>
/// Unit tests for ResultExtensions utility methods.
/// Tests side effects, combining results, and ensuring conditions.
/// </summary>
public class ResultExtensionsTests
{
    [Fact]
    public void OnSuccess_ExecutesSideEffectOnSuccess()
    {
        // Arrange
        var result = new Result<int>.Success(42);
        var sideEffectExecuted = false;
        int? capturedValue = null;

        // Act
        result.OnSuccess(value =>
        {
            sideEffectExecuted = true;
            capturedValue = value;
        });

        // Assert
        sideEffectExecuted.Should().BeTrue();
        capturedValue.Should().Be(42);
    }

    [Fact]
    public void OnSuccess_SkipsExecutionOnFailure()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);
        var sideEffectExecuted = false;

        // Act
        result.OnSuccess(_ => { sideEffectExecuted = true; });

        // Assert
        sideEffectExecuted.Should().BeFalse();
    }

    [Fact]
    public async Task OnSuccessAsync_ExecutesSideEffectAsynchronously()
    {
        // Arrange
        var result = new Result<int>.Success(42);
        var sideEffectExecuted = false;

        // Act
        await result.OnSuccessAsync(async value =>
        {
            await Task.Delay(1);
            sideEffectExecuted = true;
        });

        // Assert
        sideEffectExecuted.Should().BeTrue();
    }

    [Fact]
    public void OnFailure_ExecutesSideEffectOnFailure()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);
        var sideEffectExecuted = false;
        IReadOnlyList<Error>? capturedErrors = null;

        // Act
        result.OnFailure(errors =>
        {
            sideEffectExecuted = true;
            capturedErrors = errors;
        });

        // Assert
        sideEffectExecuted.Should().BeTrue();
        capturedErrors.Should().NotBeNull().And.HaveCount(1);
    }

    [Fact]
    public void OnFailure_SkipsExecutionOnSuccess()
    {
        // Arrange
        var result = new Result<int>.Success(42);
        var sideEffectExecuted = false;

        // Act
        result.OnFailure(_ => { sideEffectExecuted = true; });

        // Assert
        sideEffectExecuted.Should().BeFalse();
    }

    [Fact]
    public async Task OnFailureAsync_ExecutesSideEffectAsynchronously()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);
        var sideEffectExecuted = false;

        // Act
        await result.OnFailureAsync(async errors =>
        {
            await Task.Delay(1);
            sideEffectExecuted = true;
        });

        // Assert
        sideEffectExecuted.Should().BeTrue();
    }

    [Fact]
    public void Combine_AllSuccessResultsReturnsSuccessWithAllValues()
    {
        // Arrange
        var result1 = new Result<int>.Success(1);
        var result2 = new Result<int>.Success(2);
        var result3 = new Result<int>.Success(3);

        // Act
        var combined = ResultExtensions.Combine(result1, result2, result3);

        // Assert
        combined.IsSuccess.Should().BeTrue();
        if (combined is Result<IReadOnlyList<int>>.Success success)
        {
            success.Value.Should().ContainInOrder(1, 2, 3);
        }
    }

    [Fact]
    public void Combine_OneFailureReturnsFailure()
    {
        // Arrange
        var result1 = new Result<int>.Success(1);
        var error = new Error("Code", "Message");
        var result2 = new Result<int>.Failure(error);
        var result3 = new Result<int>.Success(3);

        // Act
        var combined = ResultExtensions.Combine(result1, result2, result3);

        // Assert
        combined.IsFailure.Should().BeTrue();
    }

    [Fact]
    public void Combine_EmptyResultsReturnsEmptySuccess()
    {
        // Act
        var combined = ResultExtensions.Combine<int>();

        // Assert
        combined.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void Ensure_WithTruePredicateReturnsSuccess()
    {
        // Arrange
        var result = new Result<int>.Success(42);
        var error = new Error("Code", "Message");

        // Act
        var ensured = result.Ensure(value => value > 0, error);

        // Assert
        ensured.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void Ensure_WithFalsePredicateReturnsFailure()
    {
        // Arrange
        var result = new Result<int>.Success(-5);
        var error = new Error("Code", "Message");

        // Act
        var ensured = result.Ensure(value => value > 0, error);

        // Assert
        ensured.IsFailure.Should().BeTrue();
    }

    [Fact]
    public void Ensure_WithFailureResultReturnsFailure()
    {
        // Arrange
        var initialError = new Error("Code", "Message");
        var result = new Result<int>.Failure(initialError);
        var ensureError = new Error("Code2", "Message2");

        // Act
        var ensured = result.Ensure(_ => true, ensureError);

        // Assert
        ensured.IsFailure.Should().BeTrue();
    }

    [Fact]
    public async Task EnsureAsync_WithTruePredicateReturnsSuccess()
    {
        // Arrange
        var result = new Result<int>.Success(42);
        var error = new Error("Code", "Message");

        // Act
        var ensured = await result.EnsureAsync(async value =>
        {
            await Task.CompletedTask;
            return value > 0;
        }, error);

        // Assert
        ensured.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task EnsureAsync_WithFalsePredicateReturnsFailure()
    {
        // Arrange
        var result = new Result<int>.Success(-5);
        var error = new Error("Code", "Message");

        // Act
        var ensured = await result.EnsureAsync(async value =>
        {
            await Task.CompletedTask;
            return value > 0;
        }, error);

        // Assert
        ensured.IsFailure.Should().BeTrue();
    }

    [Fact]
    public void GetValueOrThrow_ReturnsValueOnSuccess()
    {
        // Arrange
        var result = new Result<int>.Success(42);

        // Act
        var value = result.GetValueOrThrow();

        // Assert
        value.Should().Be(42);
    }

    [Fact]
    public void GetValueOrThrow_ThrowsExceptionOnFailure()
    {
        // Arrange
        var error = new Error("TestCode", "Test message");
        var result = new Result<int>.Failure(error);

        // Act & Assert
        var action = () => result.GetValueOrThrow();
        action.Should().Throw<InvalidOperationException>()
            .WithMessage("*Test message*");
    }

    [Fact]
    public void GetValueOrThrow_WithCustomExceptionFactory()
    {
        // Arrange
        var error = new Error("Code", "Message");
        var result = new Result<int>.Failure(error);

        // Act & Assert
        var action = () => result.GetValueOrThrow(errors =>
            new ArgumentException($"Custom: {errors[0].Message}"));
        action.Should().Throw<ArgumentException>()
            .WithMessage("*Custom: Message*");
    }
}
