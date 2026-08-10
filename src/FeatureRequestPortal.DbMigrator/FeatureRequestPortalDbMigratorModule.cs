using FeatureRequestPortal.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace FeatureRequestPortal.DbMigrator;

/* Depends on the application module, not just its contracts: the seed contributors that create the
 * demo account and grant the admin permissions live there, and ABP only discovers seeders from
 * modules that are actually loaded. With contracts alone they were silently skipped, so a fresh
 * clone came up with no ordinary user to sign in as. */
[DependsOn(
    typeof(AbpAutofacModule),
    typeof(FeatureRequestPortalEntityFrameworkCoreModule),
    typeof(FeatureRequestPortalApplicationModule)
    )]
public class FeatureRequestPortalDbMigratorModule : AbpModule
{
}
