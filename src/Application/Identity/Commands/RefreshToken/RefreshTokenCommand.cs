using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.RefreshToken;

public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<ServiceResult<AuthResponse>>;
