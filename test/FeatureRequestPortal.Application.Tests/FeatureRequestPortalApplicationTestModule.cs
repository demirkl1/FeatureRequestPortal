using Volo.Abp.Modularity;

namespace FeatureRequestPortal;

[DependsOn(
    typeof(FeatureRequestPortalApplicationModule),
    typeof(FeatureRequestPortalDomainTestModule)
)]
public class FeatureRequestPortalApplicationTestModule : AbpModule
{

}
