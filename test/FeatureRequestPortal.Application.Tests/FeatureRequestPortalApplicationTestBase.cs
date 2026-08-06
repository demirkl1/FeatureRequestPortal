using Volo.Abp.Modularity;

namespace FeatureRequestPortal;

public abstract class FeatureRequestPortalApplicationTestBase<TStartupModule> : FeatureRequestPortalTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
