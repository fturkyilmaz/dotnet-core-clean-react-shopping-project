namespace ShoppingProject.Application.Common.Models;

/// <summary>
/// Detailed user information Data Transfer Object (DTO).
/// </summary>
public record UserInfoResponse(
    string Id,
    string Email,
    string? FirstName,
    string? LastName,
    string? UserName,
    string? Gender,
    IReadOnlyList<string> Roles,
    string? PhoneNumber
);
