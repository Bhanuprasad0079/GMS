using System.Net;
using System.Net.Mail;

namespace GrievanceAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            // Fetch credentials from appsettings.json
            var mail = _configuration["EmailSettings:Email"];
            var pw = _configuration["EmailSettings:Password"];

            // Configure SMTP Client (for Gmail)
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(mail, pw)
            };

            // Send the email
            await client.SendMailAsync(
                new MailMessage(from: mail, to: toEmail, subject, message)
            );
        }
    }
}