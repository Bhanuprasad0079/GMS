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
        // These keys must match your Render environment variable structure
            var mail = _configuration["EmailSettings:Email"];
            var pw = _configuration["EmailSettings:Password"];
            var host = _configuration["EmailSettings:Host"] ?? "smtp.gmail.com";
            var portString = _configuration["EmailSettings:Port"] ?? "587";
            int port = int.Parse(portString);

            using (var client = new SmtpClient(host, port))
            {
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(mail, pw);

                var mailMessage = new MailMessage(from: mail, to: toEmail, subject, message)
                {
                    IsBodyHtml = true
                };

                await client.SendMailAsync(mailMessage);
            }
        }
    }
}