using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Volo.Abp;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace FeatureRequestPortal.Accounts;

/// <summary>
/// Registration is deliberately not ABP's built-in one: that signs the new account straight in.
/// Here an account has to clear two gates first - the user proves they own the mailbox with an
/// emailed code, then an admin approves the application.
/// </summary>
[AllowAnonymous]
public class AccountRegistrationAppService : FeatureRequestPortalAppService, IAccountRegistrationAppService
{
    private readonly IdentityUserManager _userManager;
    private readonly IEmailSender _emailSender;

    public AccountRegistrationAppService(IdentityUserManager userManager, IEmailSender emailSender)
    {
        _userManager = userManager;
        _emailSender = emailSender;
    }

    public virtual async Task<RegisterResultDto> RegisterAsync(RegisterUserDto input)
    {
        var user = new IdentityUser(
            GuidGenerator.Create(),
            input.UserName,
            input.Email,
            CurrentTenant.Id
        );

        /* Locked from the start: IsActive false is what stops ABP's sign-in manager letting the
         * account in before an admin has looked at it. */
        user.SetIsActive(false);

        (await _userManager.CreateAsync(user, input.Password)).CheckErrors();

        await SendVerificationCodeAsync(user);

        return new RegisterResultDto { UserId = user.Id };
    }

    public virtual async Task VerifyEmailAsync(VerifyEmailDto input)
    {
        var user = await _userManager.GetByIdAsync(input.UserId);

        if (user.EmailConfirmed)
        {
            return;
        }

        var isValid = await _userManager.VerifyUserTokenAsync(
            user,
            TokenOptions.DefaultEmailProvider,
            AccountConsts.EmailVerificationPurpose,
            input.Code
        );

        if (!isValid)
        {
            throw new BusinessException(FeatureRequestPortalDomainErrorCodes.InvalidVerificationCode);
        }

        user.SetEmailConfirmed(true);

        (await _userManager.UpdateAsync(user)).CheckErrors();
    }

    public virtual async Task ResendVerificationCodeAsync(Guid userId)
    {
        var user = await _userManager.GetByIdAsync(userId);

        if (user.EmailConfirmed)
        {
            return;
        }

        await SendVerificationCodeAsync(user);
    }

    private async Task SendVerificationCodeAsync(IdentityUser user)
    {
        /* The email token provider is TOTP based, so the code carries its own expiry and nothing
         * has to be stored alongside the user. */
        var code = await _userManager.GenerateUserTokenAsync(
            user,
            TokenOptions.DefaultEmailProvider,
            AccountConsts.EmailVerificationPurpose
        );

        await _emailSender.SendAsync(
            user.Email,
            L["Email:VerificationSubject"],
            L["Email:VerificationBody", user.UserName, code],
            isBodyHtml: true
        );
    }
}
