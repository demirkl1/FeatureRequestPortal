using FeatureRequestPortal.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace FeatureRequestPortal.Permissions;

public class FeatureRequestPortalPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(FeatureRequestPortalPermissions.GroupName);

        var featureRequests = myGroup.AddPermission(
            FeatureRequestPortalPermissions.FeatureRequests.Default,
            L("Permission:FeatureRequests")
        );

        featureRequests.AddChild(
            FeatureRequestPortalPermissions.FeatureRequests.ChangeStatus,
            L("Permission:FeatureRequests.ChangeStatus")
        );

        featureRequests.AddChild(
            FeatureRequestPortalPermissions.FeatureRequests.Delete,
            L("Permission:FeatureRequests.Delete")
        );

        var users = myGroup.AddPermission(
            FeatureRequestPortalPermissions.Users.Default,
            L("Permission:Users")
        );

        users.AddChild(
            FeatureRequestPortalPermissions.Users.Approve,
            L("Permission:Users.Approve")
        );
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<FeatureRequestPortalResource>(name);
    }
}
