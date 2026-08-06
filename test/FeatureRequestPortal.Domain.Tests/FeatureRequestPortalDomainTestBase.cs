using Volo.Abp.Modularity;

namespace FeatureRequestPortal;

/* Inherit from this class for your domain layer tests. */
public abstract class FeatureRequestPortalDomainTestBase<TStartupModule> : FeatureRequestPortalTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
