using Muzik.Helpers;
using Muzik.Interfaces;
using System.Text.RegularExpressions;
using MimeKit;
using Microsoft.Extensions.Options;

namespace Muzik.Services
{
    public class EmailService : IEmailService
    {
        private readonly IOptions<EmailSenderSettings> config;

        public EmailService(IOptions<EmailSenderSettings> config)
        {
            this.config = config;
        }

        public async Task SendEmailAsync(EmailMessage message)
        {
            var emailMessage = CreateMailMessage(message);
            await SendAsync(emailMessage);
        }

        private MimeMessage CreateMailMessage(EmailMessage message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(config.Value.DisplayName, config.Value.From));
            emailMessage.To.Add(message.To); // Use the MailboxAddress directly without validation
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = message.Content
            };

            return emailMessage;
        }
        private async Task SendAsync(MimeMessage mailMessage)
        {
            using var client = new MailKit.Net.Smtp.SmtpClient();
            await client.ConnectAsync(config.Value.SmtpServer, config.Value.Port, true);
            client.AuthenticationMechanisms.Remove("XOAUTH2");
            await client.AuthenticateAsync(config.Value.UserName, config.Value.Password);
            await client.SendAsync(mailMessage);
            await client.DisconnectAsync(true);
        }

   
    }
}
