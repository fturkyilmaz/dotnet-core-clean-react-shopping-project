using MediatR;
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<ServiceResult<AuthResponse>>;
