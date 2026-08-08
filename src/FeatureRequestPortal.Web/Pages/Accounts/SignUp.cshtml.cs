using System.Threading.Tasks;
using FeatureRequestPortal.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Validation;

namespace FeatureRequestPortal.Web.Pages.Accounts;

/// <summary>
/// Replaces ABP's built-in registration page, which signs the new account straight in. Here the
/// account stays locked until the email is verified and an admin approves it.
/// </summary>
[AllowAnonymous]
public class SignUpModel : FeatureRequestPortalPageModel
{
    [BindProperty]
    public RegisterUserDto Input { get; set; } = new();

    private readonly IAccountRegistrationAppService _accountRegistrationAppService;

    public SignUpModel(IAccountRegistrationAppService accountRegistrationAppService)
    {
        _accountRegistrationAppService = accountRegistrationAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        RegisterResultDto result;

        try
        {
            result = await _accountRegistrationAppService.RegisterAsync(Input);
        }
        catch (AbpValidationException exception)
        {
            /* Identity reports a taken username or a weak password this way; surfacing it on the
             * form is friendlier than the generic error page. */
            foreach (var error in exception.ValidationErrors)
            {
                ModelState.AddModelError(string.Empty, error.ErrorMessage ?? string.Empty);
            }

            return Page();
        }
        catch (BusinessException exception)
        {
            ModelState.AddModelError(string.Empty, exception.Message);
            return Page();
        }

        return RedirectToPage("./VerifyEmail", new { userId = result.UserId });
    }
}
