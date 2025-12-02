using FluentAssertions;
using FluentValidation.TestHelper;
using ShoppingProject.Application.Products.Commands.CreateProduct;

namespace ShoppingProject.UnitTests.Application.Validators;

public class CreateProductCommandValidatorTests
{
    private readonly CreateProductCommandValidator _validator;

    public CreateProductCommandValidatorTests()
    {
        _validator = new CreateProductCommandValidator();
    }

    [Fact]
    public void Validate_ValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "Test Product",
            Description = "Test Description",
            Price = 29.99m,
            Category = "electronics",
            Image = "https://example.com/image.jpg",
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyTitle_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "",
            Description = "Test",
            Price = 10m,
            Category = "test",
            Image = "test.jpg",
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_TitleTooLong_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = new string('a', 201), // 201 characters
            Description = "Test",
            Price = 10m,
            Category = "test",
            Image = "test.jpg",
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_EmptyDescription_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "Test",
            Description = "",
            Price = 10m,
            Category = "test",
            Image = "test.jpg",
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_EmptyCategory_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "Test",
            Description = "Test",
            Price = 10m,
            Category = "",
            Image = "test.jpg",
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Category);
    }

    [Fact]
    public void Validate_EmptyImage_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Title = "Test",
            Description = "Test",
            Price = 10m,
            Category = "test",
            Image = "",
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Image);
    }
}
