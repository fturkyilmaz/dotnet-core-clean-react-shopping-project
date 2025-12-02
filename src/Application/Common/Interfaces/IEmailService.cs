namespace ShoppingProject.Application.Common.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email, string resetToken);
        Task SendWelcomeEmailAsync(string email, string userName);
    }
}
