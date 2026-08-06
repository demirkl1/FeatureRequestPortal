using Microsoft.Extensions.Localization;
using FeatureRequestPortal.Localization;
using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace FeatureRequestPortal.Web;

[Dependency(ReplaceServices = true)]
public class FeatureRequestPortalBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<FeatureRequestPortalResource> _localizer;

    public FeatureRequestPortalBrandingProvider(IStringLocalizer<FeatureRequestPortalResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
