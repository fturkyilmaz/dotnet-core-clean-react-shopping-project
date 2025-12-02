using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using ShoppingProject.Application.Common.Interfaces;
using ShoppingProject.Infrastructure.Configuration;

namespace ShoppingProject.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailOptions _options;

        public EmailService(IOptions<EmailOptions> options)
        {
            _options = options.Value;
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var subject = "Şifre Sıfırlama Talebi";
            var resetLink = $"{_options.ClientUrl}/reset-password?token={resetToken}&email={email}";
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
            try
            {
                using var client = new SmtpClient(_options.SmtpHost, _options.SmtpPort)
                {
                    Credentials = string.IsNullOrWhiteSpace(_options.SmtpUser)
                        ? null
                        : new NetworkCredential(_options.SmtpUser, _options.SmtpPass),
                    EnableSsl = _options.EnableSsl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Timeout = 10000, // 10 saniye timeout
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_options.From),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false,
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
            }
            catch (SmtpException ex)
            {
                // SMTP bağlantı hataları için loglama
                throw new InvalidOperationException(
                    $"SMTP error while sending mail: {ex.Message}",
                    ex
                );
            }
            catch (Exception ex)
            {
                // Genel hatalar için loglama
                throw new InvalidOperationException(
                    $"Unexpected error while sending mail: {ex.Message}",
                    ex
                );
            }
        }
    }
}
