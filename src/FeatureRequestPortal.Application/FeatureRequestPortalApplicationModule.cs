using Volo.Abp.Account;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Microsoft.Extensions.DependencyInjection;

namespace FeatureRequestPortal;

[DependsOn(
    typeof(FeatureRequestPortalDomainModule),
    typeof(AbpAccountApplicationModule),
    typeof(FeatureRequestPortalApplicationContractsModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule)
    )]
public class FeatureRequestPortalApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddMapperlyObjectMapper<FeatureRequestPortalApplicationModule>();
    }
}
