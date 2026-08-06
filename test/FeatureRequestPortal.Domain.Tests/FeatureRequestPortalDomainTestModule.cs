using Volo.Abp.Modularity;

namespace FeatureRequestPortal;

[DependsOn(
    typeof(FeatureRequestPortalDomainModule),
    typeof(FeatureRequestPortalTestBaseModule)
)]
public class FeatureRequestPortalDomainTestModule : AbpModule
{

}
