using ShoppingProject.Application.Common.Models;

namespace ShoppingProject.Application.Identity.Commands.ResetPassword;

public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<ServiceResult<string>>;
