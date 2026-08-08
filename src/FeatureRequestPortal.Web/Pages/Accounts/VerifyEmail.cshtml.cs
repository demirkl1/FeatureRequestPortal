using System;
using System.Threading.Tasks;
using FeatureRequestPortal.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace FeatureRequestPortal.Web.Pages.Accounts;

[AllowAnonymous]
public class VerifyEmailModel : FeatureRequestPortalPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid UserId { get; set; }

    [BindProperty]
    public string Code { get; set; } = string.Empty;

    public string MaskedEmail { get; private set; } = string.Empty;

    public int CodeLength => AccountConsts.VerificationCodeLength;

    private readonly IAccountRegistrationAppService _accountRegistrationAppService;
    private readonly IRepository<IdentityUser, Guid> _userRepository;

    public VerifyEmailModel(
        IAccountRegistrationAppService accountRegistrationAppService,
        IRepository<IdentityUser, Guid> userRepository)
    {
        _accountRegistrationAppService = accountRegistrationAppService;
        _userRepository = userRepository;
    }

    public async Task<IActionResult> OnGetAsync()
    {
        return await LoadAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        try
        {
            await _accountRegistrationAppService.VerifyEmailAsync(
                new VerifyEmailDto { UserId = UserId, Code = Code });
        }
        catch (BusinessException exception)
            when (exception.Code == FeatureRequestPortalDomainErrorCodes.InvalidVerificationCode)
        {
            /* BusinessException carries the code, not the sentence: ABP only resolves the message
             * when it converts the exception into an HTTP response, which never happens here. */
            ModelState.AddModelError(string.Empty, L["FeatureRequestPortal:InvalidVerificationCode"].Value);
            return await LoadAsync();
        }

        return RedirectToPage("./PendingApproval");
    }

    public async Task<IActionResult> OnPostResendAsync()
    {
        await _accountRegistrationAppService.ResendVerificationCodeAsync(UserId);

        Alerts.Success(L["CodeResent"].Value);

        return await LoadAsync();
    }

    private async Task<IActionResult> LoadAsync()
    {
        var user = await _userRepository.FindAsync(UserId);

        if (user == null)
        {
            return NotFound();
        }

        if (user.EmailConfirmed)
        {
            return RedirectToPage("./PendingApproval");
        }

        MaskedEmail = Mask(user.Email);

        return Page();
    }

    /// <summary>
    /// The page is reachable by anyone holding the id, so the address is only hinted at rather
    /// than printed in full.
    /// </summary>
    private static string Mask(string email)
    {
        var at = email.IndexOf('@');

        if (at <= 1)
        {
            return email;
        }

        return $"{email[0]}{new string('*', at - 1)}{email[at..]}";
    }
}
