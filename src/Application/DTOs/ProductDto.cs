namespace ShoppingProject.Application.DTOs;

public record ProductDto(
    int Id,
    string Title,
    decimal Price,
    string Description,
    string Category,
    string Image,
    RatingDto? Rating
);
