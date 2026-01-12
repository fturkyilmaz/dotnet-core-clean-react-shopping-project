using FluentAssertions;
using ShoppingProject.Application.Common.Results;

namespace ShoppingProject.Tests.Application.Common;

/// <summary>
/// Unit tests for Error factory methods.
/// Tests pre-built error creation for common scenarios.
/// </summary>
public class ErrorTests
{
    [Fact]
    public void Create_WithCodeAndMessage()
    {
        // Act
        var error = new Error("TestCode", "Test message");

        // Assert
        error.Code.Should().Be("TestCode");
        error.Message.Should().Be("Test message");
    }

    [Fact]
    public void ValidationFailure_CreatesValidationError()
    {
        // Act
        var error = Error.ValidationFailure("Email", "Invalid email format");

        // Assert
        error.Code.Should().Be("Validation.Email");
        error.Message.Should().Be("Invalid email format");
    }

    [Fact]
    public void NotFound_CreatesNotFoundError()
    {
        // Act
        var error = Error.NotFound("Product", "123");

        // Assert
        error.Code.Should().Be("NotFound");
        error.Message.Should().Contain("Product").And.Contain("123");
    }

    [Fact]
    public void Conflict_CreatesConflictError()
    {
        // Act
        var error = Error.Conflict("Email already exists");

        // Assert
        error.Code.Should().Be("Conflict");
        error.Message.Should().Be("Email already exists");
    }

    [Fact]
    public void Forbidden_CreatesForbiddenError()
    {
        // Act
        var error = Error.Forbidden();

        // Assert
        error.Code.Should().Be("Forbidden");
        error.Message.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void Forbidden_WithCustomMessage()
    {
        // Act
        var error = Error.Forbidden("You cannot delete this resource");

        // Assert
        error.Code.Should().Be("Forbidden");
        error.Message.Should().Be("You cannot delete this resource");
    }

    [Fact]
    public void Unauthorized_CreatesUnauthorizedError()
    {
        // Act
        var error = Error.Unauthorized();

        // Assert
        error.Code.Should().Be("Unauthorized");
        error.Message.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void Unauthorized_WithCustomMessage()
    {
        // Act
        var error = Error.Unauthorized("Session expired");

        // Assert
        error.Code.Should().Be("Unauthorized");
        error.Message.Should().Be("Session expired");
    }

    [Fact]
    public void BusinessLogic_CreatesBusinessError()
    {
        // Act
        var error = Error.BusinessLogic("Insufficient inventory");

        // Assert
        error.Code.Should().Be("BusinessLogic");
        error.Message.Should().Be("Insufficient inventory");
    }

    [Fact]
    public void InternalServerError_CreatesErrorError()
    {
        // Act
        var error = Error.InternalServerError();

        // Assert
        error.Code.Should().Be("InternalServerError");
        error.Message.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void InternalServerError_WithCustomMessage()
    {
        // Act
        var error = Error.InternalServerError("Database connection failed");

        // Assert
        error.Code.Should().Be("InternalServerError");
        error.Message.Should().Be("Database connection failed");
    }

    [Fact]
    public void ErrorRecordIsValueType()
    {
        // Arrange
        var error1 = new Error("Code", "Message");
        var error2 = new Error("Code", "Message");

        // Assert - records use value equality
        error1.Should().Be(error2);
    }
}
