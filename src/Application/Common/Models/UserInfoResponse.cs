namespace ShoppingProject.Application.Common.Models;

public class UserInfoResponse
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserName { get; set; }
    public string? Gender { get; set; }
    public List<string> Roles { get; set; } = new();
}
