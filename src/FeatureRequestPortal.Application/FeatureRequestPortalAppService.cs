using System;
using System.Collections.Generic;
using System.Text;
using FeatureRequestPortal.Localization;
using Volo.Abp.Application.Services;

namespace FeatureRequestPortal;

/* Inherit your application services from this class.
 */
public abstract class FeatureRequestPortalAppService : ApplicationService
{
    protected FeatureRequestPortalAppService()
    {
        LocalizationResource = typeof(FeatureRequestPortalResource);
    }
}
