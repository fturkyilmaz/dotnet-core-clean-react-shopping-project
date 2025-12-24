using FluentAssertions;
using ShoppingProject.Application.Common.Results;

namespace ShoppingProject.Tests.Application.Common;

/// <summary>
/// Unit tests for the Result pattern (non-generic Result type).
/// Tests railway-oriented programming paradigm.
/// </summary>
public class ResultTests
{
    [Fact]
    public void Success_CreatesSuccessfulResult()
    {
        // Act
        var result = new Result.Success();

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.IsFailure.Should().BeFalse();
    }

    [Fact]
    public void Failure_CreatesFailureWithErrors()
    {
        // Arrange
        var error = new Error("TestError", "Test error message");

        // Act
        var result = new Result.Failure(error);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
        result.Should().BeOfType<Result.Failure>();

        if (result is Result.Failure failure)
        {
            failure.Errors.Should().ContainSingle();
            failure.Errors[0].Code.Should().Be("TestError");
            failure.Errors[0].Message.Should().Be("Test error message");
        }
    }

    [Fact]
    public void Failure_CreatesFailureWithMultipleErrors()
    {
        // Arrange
        var errors = new List<Error>
        {
            new Error("Error1", "First error"),
            new Error("Error2", "Second error"),
            new Error("Error3", "Third error")
        };

        // Act
        var result = new Result.Failure(errors);

        // Assert
        result.IsFailure.Should().BeTrue();
        if (result is Result.Failure failure)
        {
            failure.Errors.Should().HaveCount(3);
            failure.Errors.Should().ContainEquivalentOf(new Error("Error1", "First error"));
        }
    }

    [Fact]
    public void Match_ExecutesSuccessHandler()
    {
        // Arrange
        var result = new Result.Success();
        var successCalled = false;
        var failureCalled = false;

        // Act
        result.Match(
            _ => { successCalled = true; },
            _ => { failureCalled = true; }
        );

        // Assert
        successCalled.Should().BeTrue();
        failureCalled.Should().BeFalse();
    }

    [Fact]
    public void Match_ExecutesFailureHandler()
    {
        // Arrange
        var error = new Error("TestError", "Test message");
        var result = new Result.Failure(error);
        var successCalled = false;
        var failureCalled = false;

        // Act
        result.Match(
            _ => { successCalled = true; },
            _ => { failureCalled = true; }
        );

        // Assert
        successCalled.Should().BeFalse();
        failureCalled.Should().BeTrue();
    }

    [Fact]
    public async Task MatchAsync_ExecutesSuccessHandler()
    {
        // Arrange
        var result = new Result.Success();
        var successCalled = false;

        // Act
        await result.MatchAsync(
            async _ => { successCalled = true; await Task.CompletedTask; },
            async _ => { await Task.CompletedTask; }
        );

        // Assert
        successCalled.Should().BeTrue();
    }

    [Fact]
    public async Task MatchAsync_ExecutesFailureHandler()
    {
        // Arrange
        var error = new Error("TestError", "Test message");
        var result = new Result.Failure(error);
        var failureCalled = false;

        // Act
        await result.MatchAsync(
            async _ => { await Task.CompletedTask; },
            async _ => { failureCalled = true; await Task.CompletedTask; }
        );

        // Assert
        failureCalled.Should().BeTrue();
    }

    [Fact]
    public void Failure_FromMessageAndCode()
    {
        // Act
        var result = new Result.Failure("Custom error", "CustomCode");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Errors.Should().ContainSingle();
        result.Errors[0].Code.Should().Be("CustomCode");
        result.Errors[0].Message.Should().Be("Custom error");
    }
}
