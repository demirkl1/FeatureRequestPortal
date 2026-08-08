using System.Threading.Tasks;
using FeatureRequestPortal.Localization;
using FeatureRequestPortal.Permissions;
using FeatureRequestPortal.MultiTenancy;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Identity.Web.Navigation;
using Volo.Abp.SettingManagement.Web.Navigation;
using Volo.Abp.TenantManagement.Web.Navigation;
using Volo.Abp.UI.Navigation;
using Volo.Abp.Users;

namespace FeatureRequestPortal.Web.Menus;

public class FeatureRequestPortalMenuContributor : IMenuContributor
{
    public async Task ConfigureMenuAsync(MenuConfigurationContext context)
    {
        if (context.Menu.Name == StandardMenus.Main)
        {
            await ConfigureMainMenuAsync(context);
        }
    }

    private async Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var administration = context.Menu.GetAdministration();
        var l = context.GetLocalizer<FeatureRequestPortalResource>();

        context.Menu.Items.Insert(
            0,
            new ApplicationMenuItem(
                FeatureRequestPortalMenus.FeatureRequests,
                l["Menu:FeatureRequests"],
                "~/",
                icon: "fas fa-lightbulb",
                order: 0
            )
        );

        /* Registration replaces ABP's built-in one, so visitors get the entry point here. */
        if (!context.ServiceProvider.GetRequiredService<ICurrentUser>().IsAuthenticated)
        {
            context.Menu.Items.Insert(
                1,
                new ApplicationMenuItem(
                    FeatureRequestPortalMenus.SignUp,
                    l["SignUp"],
                    "~/Accounts/SignUp",
                    icon: "fas fa-user-plus",
                    order: 1
                )
            );
        }

        if (await context.IsGrantedAsync(FeatureRequestPortalPermissions.Users.Approve))
        {
            context.Menu.Items.Insert(
                1,
                new ApplicationMenuItem(
                    FeatureRequestPortalMenus.PendingRegistrations,
                    l["Menu:PendingRegistrations"],
                    "~/Accounts/PendingRegistrations",
                    icon: "fas fa-user-check",
                    order: 2
                )
            );
        }

        /* Creating a request requires a logged in user, so hide the item from visitors. */
        if (context.ServiceProvider.GetRequiredService<ICurrentUser>().IsAuthenticated)
        {
            context.Menu.Items.Insert(
                1,
                new ApplicationMenuItem(
                    FeatureRequestPortalMenus.NewFeatureRequest,
                    l["Menu:NewFeatureRequest"],
                    "~/FeatureRequests/Create",
                    icon: "fas fa-plus",
                    order: 1
                )
            );
        }

        if (MultiTenancyConsts.IsEnabled)
        {
            administration.SetSubItemOrder(TenantManagementMenuNames.GroupName, 1);
        }
        else
        {
            administration.TryRemoveMenuItem(TenantManagementMenuNames.GroupName);
        }

        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 2);
        administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 3);


    }
}
