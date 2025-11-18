namespace ShoppingProject.Application.DTOs
{
    public record ProductDto(int Id, string Title, string Description, decimal Price, string Category, string Image, RatingDto? Rating);
}