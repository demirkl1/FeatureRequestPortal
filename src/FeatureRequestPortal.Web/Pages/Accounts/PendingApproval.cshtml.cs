using Microsoft.AspNetCore.Authorization;

namespace FeatureRequestPortal.Web.Pages.Accounts;

[AllowAnonymous]
public class PendingApprovalModel : FeatureRequestPortalPageModel
{
    public void OnGet()
    {
    }
}
