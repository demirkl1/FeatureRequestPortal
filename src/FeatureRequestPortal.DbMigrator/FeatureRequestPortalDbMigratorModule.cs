using FeatureRequestPortal.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace FeatureRequestPortal.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(FeatureRequestPortalEntityFrameworkCoreModule),
    typeof(FeatureRequestPortalApplicationContractsModule)
    )]
public class FeatureRequestPortalDbMigratorModule : AbpModule
{
}
