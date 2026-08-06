using FeatureRequestPortal.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace FeatureRequestPortal.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class FeatureRequestPortalController : AbpControllerBase
{
    protected FeatureRequestPortalController()
    {
        LocalizationResource = typeof(FeatureRequestPortalResource);
    }
}
