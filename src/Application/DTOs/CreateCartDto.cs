namespace ShoppingProject.Application.DTOs;

public record CreateCartDto(string Title, decimal Price, string Image, int Quantity);
