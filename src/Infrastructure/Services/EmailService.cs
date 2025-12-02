using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using ShoppingProject.Application.Common.Interfaces;

namespace ShoppingProject.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var subject = "Şifre Sıfırlama Talebi";
            var resetLink =
                $"{_configuration["App:ClientUrl"]}/reset-password?token={resetToken}&email={email}";
            var body = $"Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n{resetLink}";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendWelcomeEmailAsync(string email, string userName)
        {
            var subject = "Aramıza Hoş Geldin!";
            var body =
                $"Merhaba {userName},\n\nAlışveriş dünyamıza hoş geldin! Seni burada görmek harika.";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpHost =
                _configuration["Email:SmtpHost"]
                ?? throw new ArgumentNullException("Email:SmtpHost config missing");
            var smtpPortStr =
                _configuration["Email:SmtpPort"]
                ?? throw new ArgumentNullException("Email:SmtpPort config missing");
            var smtpUser =
                _configuration["Email:SmtpUser"]
                ?? throw new ArgumentNullException("Email:SmtpUser config missing");
            var smtpPass =
                _configuration["Email:SmtpPass"]
                ?? throw new ArgumentNullException("Email:SmtpPass config missing");
            var fromEmail =
                _configuration["Email:From"]
                ?? throw new ArgumentNullException("Email:From config missing");

            if (!int.TryParse(smtpPortStr, out var smtpPort))
            {
                throw new InvalidOperationException("Email:SmtpPort must be a valid integer");
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage(fromEmail, toEmail, subject, body);
            await client.SendMailAsync(mailMessage);
        }
    }
}
