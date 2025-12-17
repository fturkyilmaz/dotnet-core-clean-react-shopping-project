namespace ShoppingProject.Application.DTOs;

public record CartDto(
    int Id,
    string Title,
    decimal Price,
    string Image,
    int Quantity,
    string OwnerId
);
