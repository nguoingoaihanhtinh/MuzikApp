namespace Muzik.Helpers
{
    public class EmailMessage
    {
        public MailboxAddress To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public EmailMessage(string? displayName, string to, string subject, string content)
        {
            // Directly assign the MailboxAddress without validation
            To = new MailboxAddress(displayName ?? "", to);
            Subject = subject;
            Content = content;
        }
    }
}
