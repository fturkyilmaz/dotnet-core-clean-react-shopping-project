using Bogus;
using FluentValidation.TestHelper;
using ShoppingProject.Application.Products.Commands.CreateProduct;

namespace ShoppingProject.UnitTests.Application.Validators;

public class CreateProductCommandValidatorTests
{
    private readonly CreateProductCommandValidator _validator;
    private readonly Faker _faker;

    public CreateProductCommandValidatorTests()
    {
        _validator = new CreateProductCommandValidator();
        _faker = new Faker();
    }

    [Fact]
    public void Validate_ValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange → Faker ile geçerli image URL üret
        var fakeImageUrl = _faker.Image.PicsumUrl(); // örn: https://picsum.photos/200/300
        var command = new CreateProductCommand("Title", 99.99m, "Desc", "Category", fakeImageUrl);

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyTitle_ShouldHaveValidationError()
    {
        var fakeImageUrl = _faker.Image.PicsumUrl();
        var command = new CreateProductCommand("", 99.99m, "Desc", "Category", fakeImageUrl);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_TitleTooLong_ShouldHaveValidationError()
    {
        var fakeImageUrl = _faker.Image.PicsumUrl();
        var command = new CreateProductCommand(new string('a', 201), 99.99m, "Desc", "Category", fakeImageUrl);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_EmptyDescription_ShouldHaveValidationError()
    {
        var fakeImageUrl = _faker.Image.PicsumUrl();
        var command = new CreateProductCommand("Test", 10m, "", "test", fakeImageUrl);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_EmptyCategory_ShouldHaveValidationError()
    {
        var fakeImageUrl = _faker.Image.PicsumUrl();
        var command = new CreateProductCommand("Test", 10m, "Test", "", fakeImageUrl);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Category);
    }

    [Fact]
    public void Validate_EmptyImage_ShouldHaveValidationError()
    {
        var command = new CreateProductCommand("Test", 10m, "Test", "test", "");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Image);
    }
}
