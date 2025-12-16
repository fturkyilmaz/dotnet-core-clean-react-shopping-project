
using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.ForgotPassword;

public record ForgotPasswordCommand(string Email) : IRequest<ServiceResult<string>>;
