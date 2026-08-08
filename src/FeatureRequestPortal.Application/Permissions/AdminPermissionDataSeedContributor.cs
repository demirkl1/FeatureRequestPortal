using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.PermissionManagement;

namespace FeatureRequestPortal.Permissions;

/// <summary>
/// ABP grants every defined permission to the admin role, but only at the moment that role is
/// first created. A permission added to the codebase later therefore never reaches an existing
/// database, which shows up as an admin who cannot open a brand new admin page. Granting it here
/// is idempotent, so it repairs upgraded databases without affecting fresh ones.
/// Lives in the application layer because the permission names are defined in
/// Application.Contracts, which the domain layer deliberately cannot see.
/// </summary>
public class AdminPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private const string AdminRoleName = "admin";

    private readonly IPermissionDataSeeder _permissionDataSeeder;

    public AdminPermissionDataSeedContributor(IPermissionDataSeeder permissionDataSeeder)
    {
        _permissionDataSeeder = permissionDataSeeder;
    }

    public Task SeedAsync(DataSeedContext context)
    {
        return _permissionDataSeeder.SeedAsync(
            RolePermissionValueProvider.ProviderName,
            AdminRoleName,
            new[]
            {
                FeatureRequestPortalPermissions.Users.Default,
                FeatureRequestPortalPermissions.Users.Approve
            },
            context.TenantId
        );
    }
}
