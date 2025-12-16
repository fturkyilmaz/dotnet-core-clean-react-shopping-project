using ShoppingProject.Application.Common.Models;
using ShoppingProject.Domain.Constants;

namespace ShoppingProject.Application.Identity.Commands.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Gender = "Unknown", // Default değer Handler yerine Command'da tutulabilir.
    string Role = Roles.Client
) : IRequest<ServiceResult<string>>;
