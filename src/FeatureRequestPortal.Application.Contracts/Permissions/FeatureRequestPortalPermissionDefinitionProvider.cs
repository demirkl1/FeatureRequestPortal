using FeatureRequestPortal.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace FeatureRequestPortal.Permissions;

public class FeatureRequestPortalPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(FeatureRequestPortalPermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(FeatureRequestPortalPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<FeatureRequestPortalResource>(name);
    }
}
