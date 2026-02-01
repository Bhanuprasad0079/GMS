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
            var mail = _configuration["EmailSettings:Email"];
            var pw = _configuration["EmailSettings:Password"];

            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(mail, pw)
            };

            // Create the message object explicitly to set HTML mode
            var mailMessage = new MailMessage(from: mail, to: toEmail, subject, message);
            mailMessage.IsBodyHtml = true; // <--- THIS FIXES THE RAW TAGS ISSUE

            await client.SendMailAsync(mailMessage);
        }
    }
}