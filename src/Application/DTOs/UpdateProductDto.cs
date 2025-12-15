namespace ShoppingProject.Application.DTOs;

public record UpdateProductDto(
    string Title,
    decimal Price,
    string Description,
    string Category,
    string Image,
    RatingDto? Rating
);
