using System.ComponentModel.DataAnnotations;

namespace ShoppingProject.Infrastructure.Configuration
{
    /// <summary>
    /// Strongly-typed email configuration options.
    /// Bound from the "Email" section in appsettings.json.
    /// </summary>
    public class EmailOptions
    {
        [Required]
        public string SmtpHost { get; set; } = string.Empty;

        [Range(1, 65535)]
        public int SmtpPort { get; set; }

        [Required]
        public string SmtpUser { get; set; } = string.Empty;

        [Required]
        public string SmtpPass { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string From { get; set; } = string.Empty;

        public bool EnableSsl { get; set; } = true;

        [Url]
        public string ClientUrl { get; set; } = string.Empty;
    }
}
