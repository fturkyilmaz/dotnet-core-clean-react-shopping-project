namespace ShoppingProject.Application.DTOs;

public record CreateProductDto(
    string Title,
    decimal Price,
    string Description,
    string Category,
    string Image,
    RatingDto? Rating
);
