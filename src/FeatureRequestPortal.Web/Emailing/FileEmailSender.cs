using System;
using System.IO;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Emailing;
using Volo.Abp.MultiTenancy;

namespace FeatureRequestPortal.Web.Emailing;

/// <summary>
/// Development-only sender used when no SMTP host is configured. It writes each message to
/// Logs/emails so the registration code and the password reset link can be read locally, which
/// means the whole flow can be exercised - and reviewed by someone cloning the repo - without
/// anyone having to hand over real mailbox credentials.
/// </summary>
public class FileEmailSender : EmailSenderBase
{
    private readonly ILogger<FileEmailSender> _logger;
    private readonly string _directory;

    public FileEmailSender(
        ICurrentTenant currentTenant,
        IEmailSenderConfiguration configuration,
        IBackgroundJobManager backgroundJobManager,
        ILogger<FileEmailSender> logger)
        : base(currentTenant, configuration, backgroundJobManager)
    {
        _logger = logger;
        _directory = Path.Combine(Directory.GetCurrentDirectory(), "Logs", "emails");
    }

    protected override async Task SendEmailAsync(MailMessage mail)
    {
        Directory.CreateDirectory(_directory);

        var fileName = $"{DateTime.Now:yyyyMMdd-HHmmss-fff}-{Guid.NewGuid():N}.txt";
        var path = Path.Combine(_directory, fileName);

        var content = new StringBuilder()
            .AppendLine($"From:    {mail.From}")
            .AppendLine($"To:      {mail.To}")
            .AppendLine($"Subject: {mail.Subject}")
            .AppendLine($"IsHtml:  {mail.IsBodyHtml}")
            .AppendLine(new string('-', 72))
            .AppendLine(mail.Body)
            .ToString();

        await File.WriteAllTextAsync(path, content, Encoding.UTF8);

        /* Logged as a warning so it is obvious in the console that nothing actually left
         * the machine - a silent no-op sender is a nasty thing to discover in production. */
        _logger.LogWarning(
            "No SMTP host configured, so the email to {To} (\"{Subject}\") was written to {Path} instead of being sent.",
            mail.To.ToString(),
            mail.Subject,
            path);
    }
}
