using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Emailing;
using Volo.Abp.Emailing.Smtp;
using Volo.Abp.Settings;

namespace FeatureRequestPortal.Web.Emailing;

/// <summary>
/// ABP expects the SMTP password setting to be stored encrypted, because the settings UI writes
/// it that way and its own implementation decrypts on read. Ours comes from .NET user secrets in
/// plain text, so that decryption would turn a perfectly good Gmail app password into noise -
/// and GetPasswordAsync is not virtual, so the value has to be supplied by a replacement class.
/// Everything else still comes from ABP's normal setting pipeline.
/// </summary>
[Dependency(ReplaceServices = true)]
public class FeatureRequestPortalSmtpEmailSenderConfiguration : ISmtpEmailSenderConfiguration, ITransientDependency
{
    private readonly ISettingProvider _settingProvider;

    public FeatureRequestPortalSmtpEmailSenderConfiguration(ISettingProvider settingProvider)
    {
        _settingProvider = settingProvider;
    }

    public async Task<string> GetHostAsync()
    {
        return await _settingProvider.GetOrNullAsync(EmailSettingNames.Smtp.Host) ?? string.Empty;
    }

    public async Task<int> GetPortAsync()
    {
        return await _settingProvider.GetAsync<int>(EmailSettingNames.Smtp.Port);
    }

    public async Task<string> GetUserNameAsync()
    {
        return await _settingProvider.GetOrNullAsync(EmailSettingNames.Smtp.UserName) ?? string.Empty;
    }

    /// <summary>Returned as stored: user secrets already hold it in plain text.</summary>
    public async Task<string> GetPasswordAsync()
    {
        return await _settingProvider.GetOrNullAsync(EmailSettingNames.Smtp.Password) ?? string.Empty;
    }

    public async Task<string> GetDomainAsync()
    {
        return await _settingProvider.GetOrNullAsync(EmailSettingNames.Smtp.Domain) ?? string.Empty;
    }

    public async Task<bool> GetEnableSslAsync()
    {
        return await _settingProvider.GetAsync<bool>(EmailSettingNames.Smtp.EnableSsl);
    }

    public async Task<bool> GetUseDefaultCredentialsAsync()
    {
        return await _settingProvider.GetAsync<bool>(EmailSettingNames.Smtp.UseDefaultCredentials);
    }

    public async Task<string> GetDefaultFromAddressAsync()
    {
        return await _settingProvider.GetOrNullAsync(EmailSettingNames.DefaultFromAddress) ?? string.Empty;
    }

    public async Task<string> GetDefaultFromDisplayNameAsync()
    {
        return await _settingProvider.GetOrNullAsync(EmailSettingNames.DefaultFromDisplayName) ?? string.Empty;
    }
}
