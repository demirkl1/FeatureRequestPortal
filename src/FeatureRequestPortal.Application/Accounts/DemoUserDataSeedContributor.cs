using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace FeatureRequestPortal.Accounts;

/// <summary>
/// ABP seeds an admin account and nothing else, so a fresh clone has no way to try the plain
/// "authenticated user" rules - and registering one now means clearing an email code and an admin
/// approval first. This seeds a ready, role-less account so the three roles can be compared
/// straight after running the migrator.
/// </summary>
public class DemoUserDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    public const string UserName = "demo";
    public const string Password = "1q2w3E*";

    private readonly IdentityUserManager _userManager;
    private readonly IGuidGenerator _guidGenerator;

    public DemoUserDataSeedContributor(IdentityUserManager userManager, IGuidGenerator guidGenerator)
    {
        _userManager = userManager;
        _guidGenerator = guidGenerator;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (await _userManager.FindByNameAsync(UserName) != null)
        {
            return;
        }

        var user = new IdentityUser(
            _guidGenerator.Create(),
            UserName,
            "demo@featurerequestportal.local",
            context.TenantId
        );

        /* Already through both registration gates: this account exists to demonstrate the rules,
         * not to demonstrate the sign-up flow. */
        user.SetEmailConfirmed(true);
        user.SetIsActive(true);

        (await _userManager.CreateAsync(user, Password)).CheckErrors();
    }
}
