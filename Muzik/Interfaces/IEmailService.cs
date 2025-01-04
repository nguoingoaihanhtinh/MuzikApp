using Muzik.Helpers;

namespace Muzik.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessage message);
}
