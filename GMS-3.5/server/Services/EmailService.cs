// using System.Net;
// using System.Net.Mail;

// namespace GrievanceAPI.Services
// {
//     public class EmailService : IEmailService
//     {
//         private readonly IConfiguration _configuration;

//         public EmailService(IConfiguration configuration)
//         {
//             _configuration = configuration;
//         }

//         public async Task SendEmailAsync(string toEmail, string subject, string message)
// {
//     // Try both colon and double-underscore patterns to be safe
//     var mail = _configuration["EmailSettings:Email"] ?? _configuration["EmailSettings__Email"];
//     var pw = _configuration["EmailSettings:Password"] ?? _configuration["EmailSettings__Password"];
    
//     if (string.IsNullOrEmpty(mail) || string.IsNullOrEmpty(pw))
//     {
//         throw new Exception("Email configuration is missing from environment variables.");
//     }

//     using (var client = new SmtpClient("smtp.gmail.com", 587))
//     {
//         client.EnableSsl = true;
//         client.Credentials = new NetworkCredential(mail, pw);

//         var mailMessage = new MailMessage(from: mail, to: toEmail, subject, message)
//         {
//             IsBodyHtml = true
//         };

//         await client.SendMailAsync(mailMessage);
//     }
// }
//     }
// }

using System;
using System.Collections.Generic;
using System.Threading.Tasks; // Required namespace
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;

namespace GrievanceAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            Configuration.Default.ApiKey.Clear();
            Configuration.Default.ApiKey.Add("api-key", _configuration["EmailSettings:ApiKey"]);
        }

        // Use the full name to avoid CS0738 if "Task" is ambiguous elsewhere
        public async System.Threading.Tasks.Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var apiInstance = new TransactionalEmailsApi();
            var sender = new SendSmtpEmailSender("GMS Support", "gms.service.mail@gmail.com");
            var to = new List<SendSmtpEmailTo> { new SendSmtpEmailTo(toEmail) };

            var sendSmtpEmail = new SendSmtpEmail(
                sender: sender,
                to: to,
                subject: subject,
                htmlContent: message
            );

            try
            {
                await apiInstance.SendTransacEmailAsync(sendSmtpEmail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Brevo API Error: {ex.Message}");
                throw;
            }
        }
    }
}